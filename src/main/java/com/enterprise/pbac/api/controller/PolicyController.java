package com.enterprise.pbac.api.controller;

import com.enterprise.pbac.api.dto.PolicyDto;
import com.enterprise.pbac.application.service.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

/**
 * Policy Management REST endpoints for CRUD operations.
 */
@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
@Slf4j
public class PolicyController {
    
    private final PolicyService policyService;
    
    @PostMapping
    public ResponseEntity<PolicyDto> createPolicy(
            @Valid @RequestBody PolicyDto policyDto,
            @RequestAttribute UUID userId) {
        
        PolicyDto created = policyService.createPolicy(policyDto, userId);
        log.info("Policy created: {} by user {}", policyDto.getName(), userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping("/{policyId}")
    public ResponseEntity<PolicyDto> getPolicyById(@PathVariable UUID policyId) {
        PolicyDto policy = policyService.getPolicyById(policyId);
        return ResponseEntity.ok(policy);
    }
    
    @PutMapping("/{policyId}")
    public ResponseEntity<PolicyDto> updatePolicy(
            @PathVariable UUID policyId,
            @Valid @RequestBody PolicyDto policyDto,
            @RequestAttribute UUID userId) {
        
        PolicyDto updated = policyService.updatePolicy(policyId, policyDto);
        log.info("Policy updated: {} by user {}", policyId, userId);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{policyId}")
    public ResponseEntity<Void> deletePolicy(
            @PathVariable UUID policyId,
            @RequestAttribute UUID userId) {
        
        policyService.deletePolicy(policyId);
        log.info("Policy deleted: {} by user {}", policyId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<List<PolicyDto>> getAllActivePolicies() {
        List<PolicyDto> policies = policyService.getAllActivePolicies();
        return ResponseEntity.ok(policies);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<PolicyDto>> searchPolicies(@RequestParam String name) {
        List<PolicyDto> policies = policyService.searchPoliciesByName(name);
        return ResponseEntity.ok(policies);
    }
}
