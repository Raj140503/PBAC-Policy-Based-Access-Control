package com.enterprise.pbac.domain.engine.strategy;

import com.enterprise.pbac.domain.entity.Policy;
import com.enterprise.pbac.domain.engine.model.AuthorizationContext;

/**
 * Strategy interface for policy evaluation.
 * Different strategies can be implemented for different policy types.
 */
public interface PolicyEvaluationStrategy {
    
    /**
     * Evaluates if a policy matches the given context.
     */
    boolean matches(Policy policy, AuthorizationContext context);
    
    /**
     * Gets the strategy name for logging.
     */
    String getStrategyName();
}
