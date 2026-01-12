package com.enterprise.pbac.domain.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "policies", indexes = {
        @Index(name = "idx_resource_action", columnList = "resource,action"),
        @Index(name = "idx_priority", columnList = "priority DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Policy {
    
    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;
    
    @Column(nullable = false, length = 255)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private PolicyEffect effect;
    
    @Column(nullable = false)
    private Integer priority = 0;
    
    @Column(name = "subject_json", nullable = false, columnDefinition = "JSONB")
    private JsonNode subjectJson;
    
    @Column(nullable = false, length = 255)
    private String resource;
    
    @Column(nullable = false, length = 255)
    private String action;
    
    @Column(name = "conditions_json", columnDefinition = "JSONB")
    private JsonNode conditionsJson;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
