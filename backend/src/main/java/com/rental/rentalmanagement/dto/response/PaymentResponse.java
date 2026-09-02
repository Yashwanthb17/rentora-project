package com.rental.rentalmanagement.dto.response;

import com.rental.rentalmanagement.entity.enums.PaymentMethod;
import com.rental.rentalmanagement.entity.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentResponse(

        Long id,
        Long agreementId,
        BigDecimal amount,
        LocalDate billingPeriod,
        LocalDate dueDate,
        LocalDate paymentDate,
        PaymentStatus status,
        PaymentMethod paymentMethod,
        String transactionReference
) {
}