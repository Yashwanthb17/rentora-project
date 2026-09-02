package com.rental.rentalmanagement.dto.response;

import com.rental.rentalmanagement.entity.enums.PropertyType;

public record PropertyResponse(
        Long id,
        String title,
        String description,
        String address,
        String city,
        String state,
        String pincode,
        PropertyType propertyType,
        boolean verified,
        Long ownerId
) {
}