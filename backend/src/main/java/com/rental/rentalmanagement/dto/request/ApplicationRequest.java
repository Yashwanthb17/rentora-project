package com.rental.rentalmanagement.dto.request;

import jakarta.validation.constraints.NotNull;

public record ApplicationRequest(

        @NotNull(message = "Unit ID is required")
        Long unitId,

        String message
) {
}