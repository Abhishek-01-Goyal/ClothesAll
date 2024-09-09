package com.clothesall.ecommerce.service;

import com.clothesall.ecommerce.dto.PaymentInfo;
import com.clothesall.ecommerce.dto.Purchase;
import com.clothesall.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws
            StripeException;
}
