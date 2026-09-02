package com.rental.rentalmanagement.dto.response;

import com.rental.rentalmanagement.entity.enums.TerminationRequestStatus;

import java.time.LocalDateTime;

public record TerminationRequestResponse(

        Long id,
        Long agreementId,
        Long tenantId,
        String reason,
        TerminationRequestStatus status,
        LocalDateTime requestedAt,
        LocalDateTime resolvedAt
) {
}
