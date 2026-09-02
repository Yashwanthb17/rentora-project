package com.rental.rentalmanagement.dto.response;

import com.rental.rentalmanagement.entity.enums.MaintenancePriority;
import com.rental.rentalmanagement.entity.enums.MaintenanceStatus;

import java.time.LocalDateTime;

public record MaintenanceResponse(

        Long id,
        Long unitId,
        Long tenantId,
        String title,
        String description,
        MaintenancePriority priority,
        MaintenanceStatus status,
        LocalDateTime createdAt,
        LocalDateTime resolvedAt
) {
}