package com.rental.rentalmanagement.controller;

import com.rental.rentalmanagement.dto.request.ApplicationRequest;
import com.rental.rentalmanagement.dto.response.ApplicationResponse;
import com.rental.rentalmanagement.dto.response.RentalAgreementResponse;
import com.rental.rentalmanagement.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @Valid @RequestBody ApplicationRequest request
    ){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(applicationService.createApplication(request));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<RentalAgreementResponse> approveApplication(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                applicationService.approveApplication(id)
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApplicationResponse> rejectApplication(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                applicationService.rejectApplication(id)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                applicationService.getApplicationById(id)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByTenant() {

        return ResponseEntity.ok(
                applicationService.getApplicationsByTenant()
        );
    }

    @GetMapping("/unit/{unitId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByUnit(
            @PathVariable Long unitId) {

        return ResponseEntity.ok(
                applicationService.getApplicationsByUnit(unitId)
        );
    }
}
