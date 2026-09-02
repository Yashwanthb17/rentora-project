package com.rental.rentalmanagement.dto.response;

import com.rental.rentalmanagement.entity.enums.AgreementStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RentalAgreementResponse(

        Long id,
        Long applicationId,
        Long tenantId,
        Long unitId,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal monthlyRent,
        BigDecimal securityDeposit,
        AgreementStatus status
) {
}