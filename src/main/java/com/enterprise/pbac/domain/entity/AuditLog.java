package com.enterprise.pbac.domain.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Immutable audit log entity recording all authorization decisions.
 * This table is append-only for compliance and debugging purposes.
 */
@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_user_timestamp", columnList = "user_id,timestamp DESC"),
        @Index(name = "idx_resource_action", columnList = "resource,action")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    
    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;
    
    @Column(name = "user_id", nullable = false, columnDefinition = "UUID")
    private UUID userId;
    
    @Column(nullable = false, length = 255)
    private String resource;
    
    @Column(nullable = false, length = 255)
    private String action;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AuthorizationDecision decision;
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    @Column(name = "request_context", columnDefinition = "JSONB")
    private JsonNode requestContext;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
    
    @PrePersist
    protected void onCreate() {
        this.id = UUID.randomUUID();
        this.timestamp = LocalDateTime.now();
    }
}
