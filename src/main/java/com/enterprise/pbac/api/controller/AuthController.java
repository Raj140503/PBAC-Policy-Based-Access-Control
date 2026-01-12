package com.enterprise.pbac.api.controller;

import com.enterprise.pbac.api.dto.AuthRequestDto;
import com.enterprise.pbac.api.dto.AuthResponseDto;
import com.enterprise.pbac.application.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication endpoints for user signup, login, and token refresh.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final AuthenticationService authenticationService;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(
            @Valid @RequestBody AuthRequestDto request,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName) {
        
        AuthResponseDto response = authenticationService.signup(request, firstName, lastName);
        log.info("User signed up: {}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthRequestDto request) {
        AuthResponseDto response = authenticationService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refreshToken(@RequestHeader("Authorization") String bearerToken) {
        String token = bearerToken.substring(7);
        AuthResponseDto response = authenticationService.refreshToken(token);
        return ResponseEntity.ok(response);
    }
}
