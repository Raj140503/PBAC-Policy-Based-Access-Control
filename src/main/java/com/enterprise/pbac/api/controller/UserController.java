package com.enterprise.pbac.api.controller;

import com.enterprise.pbac.api.dto.UserDto;
import com.enterprise.pbac.application.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

/**
 * User management endpoints for profile and attribute management.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable UUID userId) {
        UserDto user = userService.getUserDtoById(userId);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/{userId}/attributes")
    public ResponseEntity<Void> addUserAttribute(
            @PathVariable UUID userId,
            @RequestParam String key,
            @RequestParam String value,
            @RequestAttribute UUID requestingUserId) {
        
        // In production, verify user is modifying their own attributes or is admin
        userService.addUserAttribute(userId, key, value);
        log.info("User attribute added: {}={} for user {}", key, value, userId);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{userId}/deactivate")
    public ResponseEntity<Void> deactivateUser(
            @PathVariable UUID userId,
            @RequestAttribute UUID requestingUserId) {
        
        // In production, verify requestingUserId has admin privileges
        userService.deactivateUser(userId);
        log.info("User deactivated: {}", userId);
        return ResponseEntity.ok().build();
    }
}
