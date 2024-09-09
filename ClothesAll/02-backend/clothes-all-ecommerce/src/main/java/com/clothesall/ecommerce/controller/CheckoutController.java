package com.clothesall.ecommerce.controller;

import com.clothesall.ecommerce.dto.PaymentInfo;
import com.clothesall.ecommerce.dto.Purchase;
import com.clothesall.ecommerce.dto.PurchaseResponse;
import com.clothesall.ecommerce.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private Logger logger = Logger.getLogger(getClass().getName());

    private final CheckoutService checkoutService;

    @Autowired
    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public ResponseEntity<PurchaseResponse> placeOrder(@RequestBody Purchase purchase) {
        try {
            PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
            return ResponseEntity.ok(purchaseResponse);
        } catch (Exception e) {
            // Log the exception for debugging
            // logger.error("Error processing purchase", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException{

        logger.info("paymentInfo.amount: " + paymentInfo.getAmount());

        PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);
        String paymentStr = paymentIntent.toJson();

        return  new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }
}
