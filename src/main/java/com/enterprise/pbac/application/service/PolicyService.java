package com.enterprise.pbac.application.service;

import com.enterprise.pbac.api.dto.PolicyDto;
import com.enterprise.pbac.domain.entity.Policy;
import com.enterprise.pbac.domain.enums.PolicyEffect;
import com.enterprise.pbac.infrastructure.repository.PolicyRepository;
import com.enterprise.pbac.infrastructure.mapper.PolicyMapper;
import com.enterprise.pbac.application.exception.ResourceNotFoundException;
import com.enterprise.pbac.infrastructure.cache.PolicyCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing PBAC policies with caching support.
 * Implements CRUD operations and cache invalidation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PolicyService {
    
    private final PolicyRepository policyRepository;
    private final PolicyMapper policyMapper;
    private final PolicyCacheService policyCacheService;
    
    public PolicyDto createPolicy(PolicyDto policyDto, UUID createdBy) {
        Policy policy = policyMapper.toEntity(policyDto);
        policy.setId(UUID.randomUUID());
        
        // Fetch user for createdBy
        // Note: In production, fetch user entity
        
        Policy savedPolicy = policyRepository.save(policy);
        policyCacheService.invalidateApplicablePoliciesCache(policy.getResource(), policy.getAction());
        
        log.info("Policy created: {} ({})", policy.getName(), policy.getId());
        return policyMapper.toDto(savedPolicy);
    }
    
    @Transactional(readOnly = true)
    public PolicyDto getPolicyById(UUID policyId) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + policyId));
        return policyMapper.toDto(policy);
    }
    
    public PolicyDto updatePolicy(UUID policyId, PolicyDto policyDto) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + policyId));
        
        policy.setName(policyDto.getName());
        policy.setDescription(policyDto.getDescription());
        policy.setEffect(policyDto.getEffect());
        policy.setPriority(policyDto.getPriority());
        policy.setSubjectJson(policyDto.getSubject());
        policy.setResource(policyDto.getResource());
        policy.setAction(policyDto.getAction());
        policy.setConditionsJson(policyDto.getConditions());
        policy.setIsActive(policyDto.getIsActive());
        
        Policy updatedPolicy = policyRepository.save(policy);
        policyCacheService.invalidateApplicablePoliciesCache(policy.getResource(), policy.getAction());
        
        log.info("Policy updated: {}", policyId);
        return policyMapper.toDto(updatedPolicy);
    }
    
    public void deletePolicy(UUID policyId) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + policyId));
        
        policyRepository.deleteById(policyId);
        policyCacheService.invalidateApplicablePoliciesCache(policy.getResource(), policy.getAction());
        
        log.info("Policy deleted: {}", policyId);
    }
    
    @Transactional(readOnly = true)
    public List<PolicyDto> getAllActivePolicies() {
        return policyRepository.findAllActive().stream()
                .map(policyMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<PolicyDto> searchPoliciesByName(String name) {
        return policyRepository.findByNameContainingIgnoreCase(name).stream()
                .map(policyMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<Policy> getApplicablePolicies(String resource, String action) {
        // Try to get from cache first
        List<Policy> cached = policyCacheService.getApplicablePolicies(resource, action);
        if (cached != null) {
            return cached;
        }
        
        List<Policy> policies = policyRepository.findApplicablePolicies(resource, action);
        policyCacheService.cacheApplicablePolicies(resource, action, policies);
        return policies;
    }
}
