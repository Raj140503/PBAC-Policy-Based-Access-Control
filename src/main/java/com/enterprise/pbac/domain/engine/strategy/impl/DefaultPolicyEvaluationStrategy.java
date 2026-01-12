package com.enterprise.pbac.domain.engine.strategy.impl;

import com.enterprise.pbac.domain.entity.Policy;
import com.enterprise.pbac.domain.engine.model.AuthorizationContext;
import com.enterprise.pbac.domain.engine.strategy.PolicyEvaluationStrategy;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Default policy evaluation strategy.
 * Evaluates subject attributes, resource, action, and conditions.
 */
@Component
@Slf4j
public class DefaultPolicyEvaluationStrategy implements PolicyEvaluationStrategy {
    
    @Override
    public boolean matches(Policy policy, AuthorizationContext context) {
        // 1. Check resource match
        if (!policy.getResource().equals(context.getResource())) {
            return false;
        }
        
        // 2. Check action match
        if (!policy.getAction().equals(context.getAction())) {
            return false;
        }
        
        // 3. Check subject attributes match
        if (!matchesSubject(policy.getSubjectJson(), context)) {
            return false;
        }
        
        // 4. Check conditions (if any)
        if (policy.getConditionsJson() != null) {
            if (!evaluateConditions(policy.getConditionsJson(), context)) {
                return false;
            }
        }
        
        return true;
    }
    
    private boolean matchesSubject(JsonNode subjectJson, AuthorizationContext context) {
        // Handle wildcard match
        if (subjectJson.isTextual() && "*".equals(subjectJson.asText())) {
            return true;
        }
        
        // Check for role match
        if (subjectJson.has("role")) {
            String requiredRole = subjectJson.get("role").asText();
            String userRole = context.getUserAttributes().get("role");
            if (!requiredRole.equals(userRole) && !"*".equals(requiredRole)) {
                return false;
            }
        }
        
        // Check for department match
        if (subjectJson.has("department")) {
            String requiredDepartment = subjectJson.get("department").asText();
            String userDepartment = context.getUserAttributes().get("department");
            if (!requiredDepartment.equals(userDepartment) && !"*".equals(requiredDepartment)) {
                return false;
            }
        }
        
        return true;
    }
    
    private boolean evaluateConditions(JsonNode conditionsJson, AuthorizationContext context) {
        // Simplified condition evaluation
        // In production, build condition objects from JSON and evaluate them
        return true;
    }
    
    @Override
    public String getStrategyName() {
        return "DEFAULT_EVALUATION_STRATEGY";
    }
}
