package com.enterprise.pbac.domain.engine.condition;

import com.enterprise.pbac.domain.engine.model.AuthorizationContext;

/**
 * Interface for condition evaluation using Chain of Responsibility pattern.
 * Conditions are evaluated in sequence to determine if a policy matches.
 */
public interface Condition {
    
    /**
     * Evaluates if this condition is satisfied in the given context.
     */
    boolean evaluate(AuthorizationContext context);
    
    /**
     * Gets a description of this condition for logging/debugging.
     */
    String getDescription();
}
