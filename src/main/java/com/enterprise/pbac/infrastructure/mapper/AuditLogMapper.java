package com.enterprise.pbac.infrastructure.mapper;

import com.enterprise.pbac.api.dto.AuditLogDto;
import com.enterprise.pbac.domain.entity.AuditLog;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between AuditLog entity and AuditLogDto.
 */
@Component
public class AuditLogMapper {
    
    public AuditLogDto toDto(AuditLog auditLog) {
        if (auditLog == null) {
            return null;
        }
        
        return AuditLogDto.builder()
                .id(auditLog.getId())
                .userId(auditLog.getUserId())
                .resource(auditLog.getResource())
                .action(auditLog.getAction())
                .decision(auditLog.getDecision())
                .reason(auditLog.getReason())
                .requestContext(auditLog.getRequestContext())
                .timestamp(auditLog.getTimestamp())
                .build();
    }
}
