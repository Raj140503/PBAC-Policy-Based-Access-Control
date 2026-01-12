package com.enterprise.pbac.application.service;

import com.enterprise.pbac.api.dto.AuditLogDto;
import com.enterprise.pbac.domain.entity.AuditLog;
import com.enterprise.pbac.domain.enums.AuthorizationDecision;
import com.enterprise.pbac.infrastructure.repository.AuditLogRepository;
import com.enterprise.pbac.infrastructure.mapper.AuditLogMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for immutable audit logging.
 * All operations are append-only to maintain compliance and auditability.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuditService {
    
    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;
    
    public void logAuthorizationDecision(UUID userId, String resource, String action,
                                         AuthorizationDecision decision, String reason,
                                         JsonNode requestContext) {
        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .resource(resource)
                .action(action)
                .decision(decision)
                .reason(reason)
                .requestContext(requestContext)
                .build();
        
        auditLogRepository.save(auditLog);
        
        if (decision == AuthorizationDecision.DENY) {
            log.warn("Authorization denied for user {} on {}/{}: {}", userId, resource, action, reason);
        } else {
            log.debug("Authorization granted for user {} on {}/{}", userId, resource, action);
        }
    }
    
    @Transactional(readOnly = true)
    public Page<AuditLogDto> getUserAuditLogs(UUID userId, Pageable pageable) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId, pageable)
                .map(auditLogMapper::toDto);
    }
    
    @Transactional(readOnly = true)
    public Page<AuditLogDto> getResourceActionLogs(String resource, String action, Pageable pageable) {
        return auditLogRepository.findByResourceAndAction(resource, action, pageable)
                .map(auditLogMapper::toDto);
    }
    
    @Transactional(readOnly = true)
    public Page<AuditLogDto> getDeniedAuthorizationLogs(Pageable pageable) {
        return auditLogRepository.findByDecision(AuthorizationDecision.DENY, pageable)
                .map(auditLogMapper::toDto);
    }
    
    @Transactional(readOnly = true)
    public List<AuditLogDto> getAuditLogsByTimestampRange(LocalDateTime start, LocalDateTime end) {
        return auditLogRepository.findByTimestampRange(start, end).stream()
                .map(auditLogMapper::toDto)
                .collect(Collectors.toList());
    }
}
