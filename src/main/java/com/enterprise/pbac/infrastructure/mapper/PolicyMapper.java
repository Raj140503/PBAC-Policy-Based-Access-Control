package com.enterprise.pbac.infrastructure.mapper;

import com.enterprise.pbac.api.dto.PolicyDto;
import com.enterprise.pbac.domain.entity.Policy;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Policy entity and PolicyDto.
 */
@Component
public class PolicyMapper {
    
    public PolicyDto toDto(Policy policy) {
        if (policy == null) {
            return null;
        }
        
        return PolicyDto.builder()
                .id(policy.getId())
                .name(policy.getName())
                .description(policy.getDescription())
                .effect(policy.getEffect())
                .priority(policy.getPriority())
                .subject(policy.getSubjectJson())
                .resource(policy.getResource())
                .action(policy.getAction())
                .conditions(policy.getConditionsJson())
                .isActive(policy.getIsActive())
                .createdAt(policy.getCreatedAt())
                .updatedAt(policy.getUpdatedAt())
                .build();
    }
    
    public Policy toEntity(PolicyDto policyDto) {
        if (policyDto == null) {
            return null;
        }
        
        return Policy.builder()
                .name(policyDto.getName())
                .description(policyDto.getDescription())
                .effect(policyDto.getEffect())
                .priority(policyDto.getPriority())
                .subjectJson(policyDto.getSubject())
                .resource(policyDto.getResource())
                .action(policyDto.getAction())
                .conditionsJson(policyDto.getConditions())
                .isActive(policyDto.getIsActive())
                .build();
    }
}
