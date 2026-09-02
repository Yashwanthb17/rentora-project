package com.rental.rentalmanagement.dto.response;

import com.rental.rentalmanagement.entity.enums.Role;

public record UserResponse(
        Long id,
        String name,
        String email,
        String phone,
        Role role,
        boolean active
) {
}