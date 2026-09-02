package com.rental.rentalmanagement.dto.response;

import com.rental.rentalmanagement.entity.enums.ApplicationStatus;

import java.time.LocalDateTime;

public record ApplicationResponse(

        Long id,
        Long tenantId,
        Long unitId,
        String message,
        ApplicationStatus status,
        LocalDateTime appliedAt
) {
}