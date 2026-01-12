package com.enterprise.pbac.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorizationRequestDto {
    private String resource;
    private String action;
    private Map<String, Object> context;
}
