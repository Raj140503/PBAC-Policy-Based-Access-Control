package com.enterprise.pbac.infrastructure.repository;

import com.enterprise.pbac.domain.entity.Policy;
import com.enterprise.pbac.domain.enums.PolicyEffect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, UUID> {
    
    @Query("SELECT p FROM Policy p WHERE p.isActive = true " +
            "AND p.resource = ?1 AND p.action = ?2 " +
            "ORDER BY p.priority DESC")
    List<Policy> findApplicablePolicies(String resource, String action);
    
    @Query("SELECT p FROM Policy p WHERE p.isActive = true " +
            "AND p.effect = ?1 AND p.resource = ?2 " +
            "ORDER BY p.createdAt DESC")
    List<Policy> findByEffectAndResource(PolicyEffect effect, String resource);
    
    List<Policy> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT p FROM Policy p WHERE p.isActive = true")
    List<Policy> findAllActive();
}
