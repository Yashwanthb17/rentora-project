package com.rental.rentalmanagement.dto.request;

import com.rental.rentalmanagement.entity.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public record PayPaymentRequest(

        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod,

        String transactionReference
) {
}