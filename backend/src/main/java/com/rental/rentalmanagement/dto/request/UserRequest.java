package com.rental.rentalmanagement.dto.request;

import com.rental.rentalmanagement.entity.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequest(

        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 5, message = "Password must contain at least 5 characters")
        String password,

        @NotBlank(message = "Phone is required")
        String phone,

        @NotNull(message = "Role is required")
        Role role
) {
}