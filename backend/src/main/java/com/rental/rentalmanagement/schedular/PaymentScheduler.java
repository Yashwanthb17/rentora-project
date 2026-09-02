package com.rental.rentalmanagement.schedular;

import com.rental.rentalmanagement.service.PaymentService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PaymentScheduler {

    private final PaymentService paymentService;

    public PaymentScheduler(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @Scheduled(cron = "0 0 0 1 * *")
    public void generateMonthlyPayments() {
        paymentService.generateMonthlyPayments();
    }

    // Runs daily just after midnight and flips any PENDING payment whose
    // due date has passed over to OVERDUE.
    @Scheduled(cron = "0 0 1 * * *")
    public void markOverduePayments() {
        paymentService.markOverduePayments();
    }
}
