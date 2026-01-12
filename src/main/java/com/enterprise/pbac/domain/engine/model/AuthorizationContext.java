package com.enterprise.pbac.domain.engine.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;
import java.util.UUID;

/**
 * Context object containing all information needed for policy evaluation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorizationContext {
    private UUID userId;
    private Map<String, String> userAttributes;
    private String resource;
    private String action;
    private String ipAddress;
    private long timestamp;
    private Map<String, Object> additionalContext;
}
