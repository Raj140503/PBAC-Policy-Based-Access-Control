package com.enterprise.pbac.infrastructure.repository;

import com.enterprise.pbac.domain.entity.AuditLog;
import com.enterprise.pbac.domain.enums.AuthorizationDecision;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    
    Page<AuditLog> findByUserIdOrderByTimestampDesc(UUID userId, Pageable pageable);
    
    Page<AuditLog> findByResourceAndAction(String resource, String action, Pageable pageable);
    
    Page<AuditLog> findByDecision(AuthorizationDecision decision, Pageable pageable);
    
    @Query("SELECT al FROM AuditLog al WHERE al.timestamp BETWEEN ?1 AND ?2 ORDER BY al.timestamp DESC")
    List<AuditLog> findByTimestampRange(LocalDateTime start, LocalDateTime end);
}
