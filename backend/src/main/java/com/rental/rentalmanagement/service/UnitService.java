package com.rental.rentalmanagement.service;

import com.rental.rentalmanagement.dto.request.PropertyRequest;
import com.rental.rentalmanagement.dto.request.UnitRequest;
import com.rental.rentalmanagement.dto.response.PropertyResponse;
import com.rental.rentalmanagement.dto.response.UnitResponse;
import com.rental.rentalmanagement.entity.Property;
import com.rental.rentalmanagement.entity.Unit;
import com.rental.rentalmanagement.exception.ResourceNotFoundException;
import com.rental.rentalmanagement.repository.PropertyRepo;
import com.rental.rentalmanagement.repository.UnitRepo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UnitService {

    private final UnitRepo unitRepo;
    private final PropertyRepo propertyRepo;

    public UnitService(UnitRepo unitRepo, PropertyRepo propertyRepo) {
        this.unitRepo = unitRepo;
        this.propertyRepo = propertyRepo;
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isPropertyOwner(#propertyId)"
    )
    @Transactional
    public UnitResponse createUnit(UnitRequest request, Long propertyId) {

        Property property = propertyRepo.findById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with ID: "
                                        + propertyId
                        ));

        Unit unit = Unit.builder()
                .unitNumber(request.unitNumber())
                .monthlyRent(request.monthlyRent())
                .securityDeposit(request.securityDeposit())
                .status(request.status())
                .property(property)
                .build();

        return toResponse(unitRepo.save(unit));
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isUnitOwner(#id)"
    )
    @Transactional
    public UnitResponse updateUnit(Long id, UnitRequest request) {

        Unit unit = unitRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Unit not found with ID: " + id
                        ));

        unit.setUnitNumber(request.unitNumber());
        unit.setMonthlyRent(request.monthlyRent());
        unit.setSecurityDeposit(request.securityDeposit());
        unit.setStatus(request.status());

        return toResponse(unitRepo.save(unit));
    }

    @PreAuthorize(
            "hasRole('ADMIN') or " +
                    "@ownerAuthorizationService.isUnitOwner(#id)"
    )
    @Transactional
    public void deleteUnit(Long id) {

        Unit unit = unitRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Unit not found with ID: " + id
                        ));

        unitRepo.delete(unit);
    }

    public List<UnitResponse> getAllUnits(){
        return unitRepo.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UnitResponse getUnitById(Long id){
        return toResponse(unitRepo.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Unit Not found with ID: "+id)));
    }

    private Unit toUnit(UnitRequest request, Long propertyId){

        Property property = propertyRepo.findById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Property not found with ID: "+propertyId));

        return Unit.builder()
                .unitNumber(request.unitNumber())
                .monthlyRent(request.monthlyRent())
                .securityDeposit(request.securityDeposit())
                .status(request.status())
                .property(property)
                .build();
    }

    private UnitResponse toResponse(Unit unit){
        return new UnitResponse(
                unit.getId(),
                unit.getUnitNumber(),
                unit.getMonthlyRent(),
                unit.getSecurityDeposit(),
                unit.getStatus(),
                unit.getProperty().getId()
        );
    }
}
