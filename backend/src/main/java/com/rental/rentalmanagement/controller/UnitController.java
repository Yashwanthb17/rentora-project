package com.rental.rentalmanagement.controller;

import com.rental.rentalmanagement.dto.request.UnitRequest;
import com.rental.rentalmanagement.dto.response.UnitResponse;
import com.rental.rentalmanagement.entity.Unit;
import com.rental.rentalmanagement.service.UnitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @PostMapping
    public ResponseEntity<UnitResponse> createUnit(
            @Valid @RequestBody UnitRequest unit,
            @RequestParam Long propertyId
    ){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(unitService.createUnit(unit, propertyId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnitResponse> updateUnit(
            @PathVariable Long id,
            @Valid @RequestBody UnitRequest request) {

        return ResponseEntity.ok(
                unitService.updateUnit(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUnit(@PathVariable Long id) {
        unitService.deleteUnit(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<UnitResponse>> getAllUnits(){
        return ResponseEntity
                .ok(unitService.getAllUnits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnitResponse> getUnitById(@PathVariable Long id){
        return ResponseEntity
                .ok(unitService.getUnitById(id));
    }
}
