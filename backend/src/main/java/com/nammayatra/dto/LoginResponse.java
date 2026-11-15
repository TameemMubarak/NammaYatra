package com.nammayatra.dto;

import com.nammayatra.enums.Role;

public record LoginResponse(
        Long id,
        String name,
        String email,
        Role role,
        String accessToken,
        String tokenType
) {
}
