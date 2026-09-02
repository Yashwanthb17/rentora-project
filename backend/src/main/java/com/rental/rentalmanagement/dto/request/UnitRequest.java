package com.rental.rentalmanagement.dto.request;

import com.rental.rentalmanagement.entity.enums.UnitStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record UnitRequest(

        @NotBlank(message = "Unit number is required")
        String unitNumber,

        @NotNull(message = "Monthly rent is required")
        @Positive(message = "Monthly rent must be greater than zero")
        BigDecimal monthlyRent,

        @NotNull(message = "Security deposit is required")
        @Positive(message = "Security deposit must be greater than zero")
        BigDecimal securityDeposit,

        @NotNull(message = "Unit status is required")
        UnitStatus status,

        @NotNull(message = "Property ID is required")
        Long propertyId
) {
}