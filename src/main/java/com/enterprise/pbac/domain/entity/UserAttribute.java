package com.enterprise.pbac.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "user_attributes", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "attribute_key"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAttribute {
    
    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "attribute_key", nullable = false, length = 100)
    private String key;
    
    @Column(name = "attribute_value", nullable = false, length = 255)
    private String value;
    
    @PrePersist
    protected void onCreate() {
        this.id = UUID.randomUUID();
    }
}
