package com.rental.rentalmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TerminationRequestRequest(

        @NotNull(message = "Agreement ID is required")
        Long agreementId,

        @NotBlank(message = "Reason is required")
        String reason
) {
}
