package com.rental.rentalmanagement.controller;

import com.rental.rentalmanagement.dto.request.CreateMaintenanceRequest;
import com.rental.rentalmanagement.dto.response.MaintenanceResponse;
import com.rental.rentalmanagement.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceRequestController {

    private final MaintenanceRequestService maintenanceRequestService;

    public MaintenanceRequestController(
            MaintenanceRequestService maintenanceRequestService) {

        this.maintenanceRequestService = maintenanceRequestService;
    }

    @PostMapping
    public ResponseEntity<MaintenanceResponse> createRequest(
            @Valid @RequestBody CreateMaintenanceRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        maintenanceRequestService.createRequest(request)
                );
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<MaintenanceResponse> startRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                maintenanceRequestService.startRequest(id)
        );
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<MaintenanceResponse> resolveRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                maintenanceRequestService.resolveRequest(id)
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<MaintenanceResponse> cancelRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                maintenanceRequestService.cancelRequest(id)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceResponse> getRequestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                maintenanceRequestService.getRequestById(id)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<MaintenanceResponse>> getRequestsByTenant() {
        return ResponseEntity.ok(maintenanceRequestService.getRequestsByTenant());
    }

    @GetMapping("/unit/{unitId}")
    public ResponseEntity<List<MaintenanceResponse>>
    getRequestsByUnit(@PathVariable Long unitId) {

        return ResponseEntity.ok(
                maintenanceRequestService
                        .getRequestsByUnit(unitId)
        );
    }
}