package com.enterprise.pbac;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Spring Boot application entry point for the Policy-Based Access Control System.
 */
@SpringBootApplication
@EnableCaching
@EnableScheduling
public class PbacSystemApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(PbacSystemApplication.class, args);
    }
}
