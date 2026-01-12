package com.enterprise.pbac.api.dto;

import com.enterprise.pbac.domain.enums.AuthorizationDecision;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorizationResponseDto {
    private AuthorizationDecision decision;
    private String reason;
    private long evaluationTimeMs;
}
