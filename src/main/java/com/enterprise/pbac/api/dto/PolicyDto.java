package com.enterprise.pbac.api.dto;

import com.enterprise.pbac.domain.enums.PolicyEffect;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyDto {
    
    private UUID id;
    
    @NotBlank(message = "Policy name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Effect (ALLOW/DENY) is required")
    private PolicyEffect effect;
    
    @NotNull(message = "Priority is required")
    private Integer priority;
    
    @NotNull(message = "Subject is required")
    private JsonNode subject;
    
    @NotBlank(message = "Resource is required")
    private String resource;
    
    @NotBlank(message = "Action is required")
    private String action;
    
    private JsonNode conditions;
    
    private Boolean isActive = true;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
