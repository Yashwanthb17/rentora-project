package com.rental.rentalmanagement.dto.request;

import jakarta.validation.constraints.NotNull;

public record PaymentRequest(

        @NotNull(message = "Agreement ID is required")
        Long agreementId
) {
}