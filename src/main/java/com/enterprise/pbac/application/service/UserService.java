package com.enterprise.pbac.application.service;

import com.enterprise.pbac.api.dto.UserDto;
import com.enterprise.pbac.domain.entity.User;
import com.enterprise.pbac.infrastructure.repository.UserRepository;
import com.enterprise.pbac.infrastructure.mapper.UserMapper;
import com.enterprise.pbac.application.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    public User registerUser(String email, String password, String firstName, String lastName) {
        if (userRepository.existsByEmail(email)) {
            log.warn("Registration attempted with existing email: {}", email);
            throw new IllegalArgumentException("Email already exists");
        }
        
        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .firstName(firstName)
                .lastName(lastName)
                .isActive(true)
                .build();
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", email);
        return savedUser;
    }
    
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    
    @Transactional(readOnly = true)
    public UserDto getUserDtoById(UUID userId) {
        User user = userRepository.findByIdWithAttributes(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return userMapper.toDto(user);
    }
    
    public void addUserAttribute(UUID userId, String key, String value) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.addAttribute(key, value);
        userRepository.save(user);
        log.info("Attribute added to user {}: {}={}", userId, key, value);
    }
    
    public void deactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setIsActive(false);
        userRepository.save(user);
        log.info("User deactivated: {}", userId);
    }
}
