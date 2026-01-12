package com.enterprise.pbac.domain.engine.condition.impl;

import com.enterprise.pbac.domain.engine.condition.Condition;
import com.enterprise.pbac.domain.engine.model.AuthorizationContext;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Condition that checks if the request originates from an allowed IP range.
 * Useful for network-based access control.
 */
@Data
@AllArgsConstructor
public class IpRangeCondition implements Condition {
    private String allowedIpRange;
    
    @Override
    public boolean evaluate(AuthorizationContext context) {
        // Simplified IP range check; in production, use proper CIDR parsing
        return context.getIpAddress() != null && 
               context.getIpAddress().startsWith(allowedIpRange);
    }
    
    @Override
    public String getDescription() {
        return String.format("IP range: %s", allowedIpRange);
    }
}
