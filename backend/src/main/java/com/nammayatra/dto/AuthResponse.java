package com.nammayatra.dto;

import com.nammayatra.enums.Role;

public record AuthResponse(
        Long id,
        String name,
        String email,
        Role role,
        String message
) {
}
