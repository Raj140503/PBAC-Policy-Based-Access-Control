package com.enterprise.pbac.domain.engine.model;

import com.enterprise.pbac.domain.enums.AuthorizationDecision;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

/**
 * Result of policy evaluation containing the decision and explanation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyEvaluationResult {
    private AuthorizationDecision decision;
    private String reason;
    private UUID matchedPolicyId;
    private long evaluationTimeMs;
}
