package com.enterprise.pbac.api.dto;

import com.enterprise.pbac.domain.enums.AuthorizationDecision;
import com.fasterxml.jackson.databind.JsonNode;
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
public class AuditLogDto {
    private UUID id;
    private UUID userId;
    private String resource;
    private String action;
    private AuthorizationDecision decision;
    private String reason;
    private JsonNode requestContext;
    private LocalDateTime timestamp;
}
