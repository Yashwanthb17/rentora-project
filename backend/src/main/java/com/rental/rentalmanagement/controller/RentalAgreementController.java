package com.rental.rentalmanagement.controller;

import com.rental.rentalmanagement.dto.response.RentalAgreementResponse;
import com.rental.rentalmanagement.service.RentalAgreementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agreements")
public class RentalAgreementController {

    private final RentalAgreementService agreementService;

    public RentalAgreementController(RentalAgreementService agreementService) {
        this.agreementService = agreementService;
    }

    @PutMapping("/{id}/terminate")
    public ResponseEntity<RentalAgreementResponse> terminateAgreement(@PathVariable Long id){
        return ResponseEntity.ok(agreementService.terminateAgreement(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalAgreementResponse> getAgreementById(@PathVariable Long id){
        return ResponseEntity.ok(agreementService.getAgreementById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<RentalAgreementResponse>> getAgreementsByTenant(){
        return ResponseEntity.ok(agreementService.getAgreementsByTenant());
    }

    @GetMapping("/unit/{unitId}")
    public ResponseEntity<List<RentalAgreementResponse>> getAgreementsByUnit(@PathVariable Long unitId){
        return ResponseEntity.ok(agreementService.getAgreementsByUnit(unitId));
    }

}
