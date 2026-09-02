package com.rental.rentalmanagement.dto.response;

import com.rental.rentalmanagement.entity.enums.UnitStatus;

import java.math.BigDecimal;

public record UnitResponse(

        Long id,
        String unitNumber,
        BigDecimal monthlyRent,
        BigDecimal securityDeposit,
        UnitStatus status,
        Long propertyId
) {
}