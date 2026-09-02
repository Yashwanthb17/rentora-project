package com.rental.rentalmanagement.dto.request;

import com.rental.rentalmanagement.entity.enums.MaintenancePriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateMaintenanceRequest(

        @NotNull(message = "Unit ID is required")
        Long unitId,

        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Priority is required")
        MaintenancePriority priority
) {
}