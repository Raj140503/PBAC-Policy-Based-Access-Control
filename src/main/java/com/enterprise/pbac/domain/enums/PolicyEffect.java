package com.enterprise.pbac.domain.enums;

public enum PolicyEffect {
    ALLOW("Allow access"),
    DENY("Deny access");
    
    private final String description;
    
    PolicyEffect(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
