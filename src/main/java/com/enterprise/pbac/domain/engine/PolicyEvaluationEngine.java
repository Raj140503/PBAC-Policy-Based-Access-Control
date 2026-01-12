package com.enterprise.pbac.domain.engine;

import com.enterprise.pbac.domain.entity.Policy;
import com.enterprise.pbac.domain.enums.PolicyEffect;
import com.enterprise.pbac.domain.engine.model.AuthorizationContext;
import com.enterprise.pbac.domain.engine.model.PolicyEvaluationResult;
import com.enterprise.pbac.domain.enums.AuthorizationDecision;
import com.enterprise.pbac.domain.engine.strategy.PolicyEvaluationStrategy;
import com.enterprise.pbac.application.service.PolicyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.UUID;

/**
 * Core policy evaluation engine implementing PBAC logic.
 * 
 * Evaluation Algorithm:
 * 1. Fetch all applicable policies (by resource and action)
 * 2. Evaluate policies in priority order (highest first)
 * 3. Apply DENY-overrides-ALLOW conflict resolution
 * 4. Return first matching decision
 * 5. Default to DENY if no policies match
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PolicyEvaluationEngine {
    
    private final PolicyService policyService;
    private final PolicyEvaluationStrategy evaluationStrategy;
    
    public PolicyEvaluationResult evaluate(AuthorizationContext context) {
        long startTime = System.currentTimeMillis();
        
        try {
            // 1. Fetch applicable policies
            List<Policy> applicablePolicies = policyService.getApplicablePolicies(
                    context.getResource(),
                    context.getAction()
            );
            
            // 2. Look for explicit DENY policies first (DENY overrides ALLOW)
            PolicyEvaluationResult denyResult = evaluatePoliciesByEffect(
                    applicablePolicies,
                    context,
                    PolicyEffect.DENY
            );
            
            if (denyResult != null) {
                denyResult.setEvaluationTimeMs(System.currentTimeMillis() - startTime);
                return denyResult;
            }
            
            // 3. If no DENY, look for ALLOW policies
            PolicyEvaluationResult allowResult = evaluatePoliciesByEffect(
                    applicablePolicies,
                    context,
                    PolicyEffect.ALLOW
            );
            
            if (allowResult != null) {
                allowResult.setEvaluationTimeMs(System.currentTimeMillis() - startTime);
                return allowResult;
            }
            
            // 4. Default to DENY if no policies match
            return PolicyEvaluationResult.builder()
                    .decision(AuthorizationDecision.DENY)
                    .reason("No applicable policies found for resource: " + context.getResource() +
                            ", action: " + context.getAction())
                    .evaluationTimeMs(System.currentTimeMillis() - startTime)
                    .build();
            
        } catch (Exception e) {
            log.error("Error during policy evaluation", e);
            // Fail secure: deny on evaluation error
            return PolicyEvaluationResult.builder()
                    .decision(AuthorizationDecision.DENY)
                    .reason("Policy evaluation error: " + e.getMessage())
                    .evaluationTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }
    }
    
    private PolicyEvaluationResult evaluatePoliciesByEffect(
            List<Policy> policies,
            AuthorizationContext context,
            PolicyEffect targetEffect) {
        
        for (Policy policy : policies) {
            if (policy.getEffect() != targetEffect) {
                continue;
            }
            
            if (evaluationStrategy.matches(policy, context)) {
                log.debug("Policy matched: {} (Effect: {})", policy.getName(), targetEffect);
                return PolicyEvaluationResult.builder()
                        .decision(targetEffect == PolicyEffect.ALLOW ?
                                AuthorizationDecision.ALLOW : AuthorizationDecision.DENY)
                        .reason("Matched policy: " + policy.getName())
                        .matchedPolicyId(policy.getId())
                        .build();
            }
        }
        
        return null;
    }
}
