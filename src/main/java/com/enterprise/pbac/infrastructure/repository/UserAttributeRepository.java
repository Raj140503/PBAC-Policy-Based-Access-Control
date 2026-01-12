package com.enterprise.pbac.infrastructure.repository;

import com.enterprise.pbac.domain.entity.UserAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface UserAttributeRepository extends JpaRepository<UserAttribute, UUID> {
    
    List<UserAttribute> findByUserId(UUID userId);
}
