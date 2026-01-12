package com.enterprise.pbac.api.controller;

import com.enterprise.pbac.api.dto.AuditLogDto;
import com.enterprise.pbac.application.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

/**
 * Audit logging endpoints for viewing authorization logs and decisions.
 */
@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@Slf4j
public class AuditController {
    
    private final AuditService auditService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<AuditLogDto>> getUserAuditLogs(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<AuditLogDto> logs = auditService.getUserAuditLogs(
                userId,
                PageRequest.of(page, size, Sort.by("timestamp").descending())
        );
        
        return ResponseEntity.ok(logs);
    }
    
    @GetMapping("/resource/{resource}/action/{action}")
    public ResponseEntity<Page<AuditLogDto>> getResourceActionLogs(
            @PathVariable String resource,
            @PathVariable String action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<AuditLogDto> logs = auditService.getResourceActionLogs(
                resource,
                action,
                PageRequest.of(page, size, Sort.by("timestamp").descending())
        );
        
        return ResponseEntity.ok(logs);
    }
    
    @GetMapping("/denied")
    public ResponseEntity<Page<AuditLogDto>> getDeniedAuthorizationLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<AuditLogDto> logs = auditService.getDeniedAuthorizationLogs(
                PageRequest.of(page, size, Sort.by("timestamp").descending())
        );
        
        return ResponseEntity.ok(logs);
    }
}
