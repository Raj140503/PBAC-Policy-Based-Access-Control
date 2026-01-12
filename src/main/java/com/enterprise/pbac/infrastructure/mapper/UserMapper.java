package com.enterprise.pbac.infrastructure.mapper;

import com.enterprise.pbac.api.dto.UserDto;
import com.enterprise.pbac.domain.entity.User;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

/**
 * Mapper for converting between User entity and UserDto.
 */
@Component
public class UserMapper {
    
    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .isActive(user.getIsActive())
                .attributes(user.getAttributes().stream()
                        .collect(Collectors.toMap(
                                attr -> attr.getKey(),
                                attr -> attr.getValue()
                        )))
                .createdAt(user.getCreatedAt())
                .build();
    }
}
