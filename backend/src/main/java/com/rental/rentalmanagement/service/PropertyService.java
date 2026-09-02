package com.rental.rentalmanagement.service;

import com.rental.rentalmanagement.dto.request.PropertyRequest;
import com.rental.rentalmanagement.dto.response.PropertyResponse;
import com.rental.rentalmanagement.entity.Property;
import com.rental.rentalmanagement.entity.User;
import com.rental.rentalmanagement.exception.ResourceNotFoundException;
import com.rental.rentalmanagement.repository.PropertyRepo;
import com.rental.rentalmanagement.repository.UserRepo;
import com.rental.rentalmanagement.security.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepo propertyRepo;
    private final UserRepo userRepo;
    private final CurrentUserService currentUserService;

    public PropertyService(PropertyRepo propertyRepo, UserRepo userRepo, CurrentUserService currentUserService) {
        this.propertyRepo = propertyRepo;
        this.userRepo = userRepo;
        this.currentUserService = currentUserService;
    }

    //Update/delete
//    @PreAuthorize(
//            "hasRole('ADMIN') or " +
//                    "@ownerAuthorizationService.isPropertyOwner(#propertyId)"
//    )

    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public PropertyResponse createProperty(PropertyRequest request) {

        Long ownerId = currentUserService.getCurrentUserId();

        User owner = userRepo.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: " + ownerId
                        ));
        return toResponse(propertyRepo.save(toProperty(request, ownerId)));
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isPropertyOwner(#id)"
    )
    @Transactional
    public PropertyResponse updateProperty(Long id, PropertyRequest request) {

        Property property = propertyRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with ID: " + id
                        ));

        property.setTitle(request.title());
        property.setDescription(request.description());
        property.setAddress(request.address());
        property.setCity(request.city());
        property.setState(request.state());
        property.setPincode(request.pincode());
        property.setPropertyType(request.propertyType());

        return toResponse(propertyRepo.save(property));
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isPropertyOwner(#id)"
    )
    @Transactional
    public void deleteProperty(Long id) {

        Property property = propertyRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with ID: " + id
                        ));
        propertyRepo.delete(property);
    }

    public List<PropertyResponse> getAllProperties(){
        return propertyRepo.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PropertyResponse getPropertyById(Long id){
        return toResponse(
                propertyRepo.findById(id)
                        .orElseThrow(()->new ResourceNotFoundException("Property Not found with ID: "+id))
        );
    }

    private Property toProperty(PropertyRequest request, Long ownerId){

        User owner = userRepo.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Owner not found with ID: "+ownerId)
                );

        return Property.builder()
                .title(request.title())
                .description(request.description())
                .address(request.address())
                .city(request.city())
                .state(request.state())
                .pincode(request.pincode())
                .propertyType(request.propertyType())
                .owner(owner)
                .build();
    }

    private PropertyResponse toResponse(Property property) {

        return new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getDescription(),
                property.getAddress(),
                property.getCity(),
                property.getState(),
                property.getPincode(),
                property.getPropertyType(),
                property.isVerified(),
                property.getOwner().getId()
        );
    }
}
