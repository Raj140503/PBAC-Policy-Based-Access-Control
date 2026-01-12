package com.enterprise.pbac.application.service;

import com.enterprise.pbac.api.dto.AuthRequestDto;
import com.enterprise.pbac.api.dto.AuthResponseDto;
import com.enterprise.pbac.domain.entity.User;
import com.enterprise.pbac.application.exception.AuthenticationException;
import com.enterprise.pbac.infrastructure.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthenticationService {
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    
    public AuthResponseDto signup(AuthRequestDto request, String firstName, String lastName) {
        User user = userService.registerUser(request.getEmail(), request.getPassword(), firstName, lastName);
        return generateTokenResponse(user);
    }
    
    public AuthResponseDto login(AuthRequestDto request) {
        User user = userService.getUserByEmail(request.getEmail());
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Failed login attempt for user: {}", request.getEmail());
            throw new AuthenticationException("Invalid credentials");
        }
        
        if (!user.getIsActive()) {
            log.warn("Login attempt for inactive user: {}", request.getEmail());
            throw new AuthenticationException("User account is inactive");
        }
        
        log.info("User logged in successfully: {}", request.getEmail());
        return generateTokenResponse(user);
    }
    
    public AuthResponseDto refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new AuthenticationException("Invalid or expired refresh token");
        }
        
        String userEmail = jwtTokenProvider.getUserEmailFromToken(refreshToken);
        User user = userService.getUserByEmail(userEmail);
        return generateTokenResponse(user);
    }
    
    private AuthResponseDto generateTokenResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail(), user.getId());
        
        return AuthResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getAccessTokenExpirationTime())
                .build();
    }
}
