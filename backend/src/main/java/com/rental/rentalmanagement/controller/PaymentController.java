package com.rental.rentalmanagement.controller;

import com.rental.rentalmanagement.dto.request.PayPaymentRequest;
import com.rental.rentalmanagement.dto.request.PaymentRequest;
import com.rental.rentalmanagement.dto.response.PaymentResponse;
import com.rental.rentalmanagement.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/generate")
    public ResponseEntity<PaymentResponse> generatePayment(
            @Valid @RequestBody PaymentRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(paymentService.generatePayment(
                        request.agreementId()
                ));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<PaymentResponse> payPayment(
            @PathVariable Long id,
            @Valid @RequestBody PayPaymentRequest request) {

        return ResponseEntity.ok(
                paymentService.payPayment(
                        id,
                        request.paymentMethod(),
                        request.transactionReference()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id){
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/agreement/{agreementId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByAgreement(@PathVariable Long agreementId){
        return ResponseEntity.ok(paymentService.getPaymentsByAgreement(agreementId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByTenant(){
        return ResponseEntity.ok(paymentService.getPaymentsByTenant());
    }
}
