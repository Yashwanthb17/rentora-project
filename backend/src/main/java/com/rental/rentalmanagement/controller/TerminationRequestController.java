package com.rental.rentalmanagement.controller;

import com.rental.rentalmanagement.dto.request.TerminationRequestRequest;
import com.rental.rentalmanagement.dto.response.TerminationRequestResponse;
import com.rental.rentalmanagement.service.TerminationRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/termination-requests")
public class TerminationRequestController {

    private final TerminationRequestService terminationRequestService;

    public TerminationRequestController(
            TerminationRequestService terminationRequestService) {

        this.terminationRequestService = terminationRequestService;
    }

    @PostMapping
    public ResponseEntity<TerminationRequestResponse> createRequest(
            @Valid @RequestBody TerminationRequestRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(terminationRequestService.createRequest(request));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<TerminationRequestResponse> approveRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                terminationRequestService.approveRequest(id)
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<TerminationRequestResponse> rejectRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                terminationRequestService.rejectRequest(id)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TerminationRequestResponse> getRequestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                terminationRequestService.getRequestById(id)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<TerminationRequestResponse>> getRequestsByTenant() {

        return ResponseEntity.ok(
                terminationRequestService.getRequestsByTenant()
        );
    }

    @GetMapping("/agreement/{agreementId}")
    public ResponseEntity<List<TerminationRequestResponse>> getRequestsByAgreement(
            @PathVariable Long agreementId) {

        return ResponseEntity.ok(
                terminationRequestService.getRequestsByAgreement(agreementId)
        );
    }
}
