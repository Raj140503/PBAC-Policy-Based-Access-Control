package com.enterprise.pbac.api.controller;

import com.enterprise.pbac.api.dto.AuthorizationRequestDto;
import com.enterprise.pbac.api.dto.AuthorizationResponseDto;
import com.enterprise.pbac.domain.engine.PolicyEvaluationEngine;
import com.enterprise.pbac.domain.engine.model.AuthorizationContext;
import com.enterprise.pbac.domain.engine.model.PolicyEvaluationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

/**
 * Authorization evaluation endpoint for testing authorization decisions.
 */
@RestController
@RequestMapping("/api/authorization")
@RequiredArgsConstructor
@Slf4j
public class AuthorizationController {
    
    private final PolicyEvaluationEngine policyEvaluationEngine;
    
    @PostMapping("/check")
    public ResponseEntity<AuthorizationResponseDto> checkAuthorization(
            @RequestBody AuthorizationRequestDto request,
            @RequestAttribute UUID userId) {
        
        AuthorizationContext context = AuthorizationContext.builder()
                .userId(userId)
                .resource(request.getResource())
                .action(request.getAction())
                .additionalContext(request.getContext())
                .build();
        
        PolicyEvaluationResult result = policyEvaluationEngine.evaluate(context);
        
        AuthorizationResponseDto response = AuthorizationResponseDto.builder()
                .decision(result.getDecision())
                .reason(result.getReason())
                .evaluationTimeMs(result.getEvaluationTimeMs())
                .build();
        
        return ResponseEntity.ok(response);
    }
}
