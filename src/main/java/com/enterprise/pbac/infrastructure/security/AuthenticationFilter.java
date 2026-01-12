package com.enterprise.pbac.infrastructure.security;

import com.enterprise.pbac.application.exception.AuthenticationException;
import com.enterprise.pbac.infrastructure.security.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

/**
 * Authentication filter that validates JWT tokens and populates SecurityContext.
 * Runs once per request to extract and validate the JWT token.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenProvider jwtTokenProvider;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain) throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            String token = jwtTokenProvider.extractTokenFromBearerString(authHeader);
            
            if (token != null && jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.getUserEmailFromToken(token);
                UUID userId = jwtTokenProvider.getUserIdFromToken(token);
                
                // Create authentication token
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                new ArrayList<>() // Authorities would be added here
                        );
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Store userId in request for later use
                request.setAttribute("userId", userId);
                request.setAttribute("userEmail", email);
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("JWT authentication successful for user: {}", email);
            }
        } catch (Exception e) {
            log.warn("Failed to set user authentication: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
}
