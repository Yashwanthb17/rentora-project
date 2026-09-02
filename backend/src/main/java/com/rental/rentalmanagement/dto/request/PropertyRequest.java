package com.rental.rentalmanagement.dto.request;

import com.rental.rentalmanagement.entity.enums.PropertyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PropertyRequest(

        @NotBlank(message = "Title is required")
        String title,

        String description,

        @NotBlank(message = "Address is required")
        String address,

        @NotBlank(message = "City is required")
        String city,

        @NotBlank(message = "State is required")
        String state,

        @NotBlank(message = "Pincode is required")
        String pincode,

        @NotNull(message = "Property type is required")
        PropertyType propertyType
) {
}