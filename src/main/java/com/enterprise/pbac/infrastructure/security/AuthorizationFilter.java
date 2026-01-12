package com.enterprise.pbac.infrastructure.security;

import com.enterprise.pbac.domain.engine.PolicyEvaluationEngine;
import com.enterprise.pbac.domain.engine.model.AuthorizationContext;
import com.enterprise.pbac.domain.engine.model.PolicyEvaluationResult;
import com.enterprise.pbac.domain.enums.AuthorizationDecision;
import com.enterprise.pbac.application.service.AuditService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.*;

/**
 * Authorization filter that evaluates policies before allowing access to protected resources.
 * Integrates with the policy evaluation engine and audit logging.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthorizationFilter extends OncePerRequestFilter {
    
    private final PolicyEvaluationEngine policyEvaluationEngine;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;
    
    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
            "/api/auth/signup",
            "/api/auth/login",
            "/api/auth/refresh",
            "/swagger-ui",
            "/v3/api-docs"
    );
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String requestPath = request.getRequestURI();
        
        // Skip authorization for public endpoints
        if (isPublicEndpoint(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Extract resource and action from request
        String resource = extractResource(requestPath);
        String action = request.getMethod();
        
        UUID userId = (UUID) request.getAttribute("userId");
        
        if (userId == null) {
            log.warn("Unauthorized access attempt to: {}", requestPath);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid token");
            return;
        }
        
        // Build authorization context
        AuthorizationContext context = AuthorizationContext.builder()
                .userId(userId)
                .resource(resource)
                .action(action)
                .ipAddress(getClientIpAddress(request))
                .timestamp(System.currentTimeMillis())
                .userAttributes(extractUserAttributes())
                .build();
        
        // Evaluate policies
        PolicyEvaluationResult evaluationResult = policyEvaluationEngine.evaluate(context);
        
        // Log audit
        ObjectNode contextNode = objectMapper.createObjectNode();
        contextNode.put("resource", resource);
        contextNode.put("action", action);
        contextNode.put("ipAddress", context.getIpAddress());
        
        auditService.logAuthorizationDecision(
                userId,
                resource,
                action,
                evaluationResult.getDecision(),
                evaluationResult.getReason(),
                contextNode
        );
        
        // Check decision
        if (evaluationResult.getDecision() == AuthorizationDecision.DENY) {
            log.warn("Authorization denied for user {} on {}/{}: {}",
                    userId, resource, action, evaluationResult.getReason());
            response.sendError(HttpServletResponse.SC_FORBIDDEN,
                    "Access denied: " + evaluationResult.getReason());
            return;
        }
        
        log.debug("Authorization granted for user {} on {}/{}", userId, resource, action);
        filterChain.doFilter(request, response);
    }
    
    private boolean isPublicEndpoint(String requestPath) {
        return PUBLIC_ENDPOINTS.stream().anyMatch(requestPath::startsWith);
    }
    
    private String extractResource(String requestPath) {
        // Simple resource extraction logic
        // In production, implement sophisticated routing
        String[] parts = requestPath.split("/");
        return parts.length > 2 ? parts[2] : "unknown";
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        return request.getRemoteAddr();
    }
    
    private Map<String, String> extractUserAttributes() {
        // Extract from SecurityContext in production
        return new HashMap<>();
    }
}
