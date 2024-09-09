package com.clothesall.ecommerce.service;

import com.clothesall.ecommerce.dao.CustomerRepository;
import com.clothesall.ecommerce.dto.PaymentInfo;
import com.clothesall.ecommerce.dto.Purchase;
import com.clothesall.ecommerce.dto.PurchaseResponse;
import com.clothesall.ecommerce.entity.Customer;
import com.clothesall.ecommerce.entity.Order;
import com.clothesall.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               @Value("${stripe.key.secret}") String secretKey) {

        this.customerRepository = customerRepository;

        Stripe.apiKey = secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // Null check for purchase object
        if (purchase == null) {
            throw new IllegalArgumentException("Purchase cannot be null");
        }

        // Retrieve the order from dto
        Order order = purchase.getOrder();
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }

        // Generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // Populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        if (orderItems != null) {
            orderItems.forEach(order::add);
        }

        // Populate order with addresses
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // Populate customer with order
        Customer customer = purchase.getCustomer();

        String theEmail = customer.getEmail();

        Customer customerFromDB = customerRepository.findByEmail(theEmail);
        if (customerFromDB != null) {
            customer = customerFromDB;
        }
        customer.add(order);

        // Save customer (this will save the order and order items as well)
        customerRepository.save(customer);

        // Return a response with the tracking number
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        if (paymentInfo == null) {
            throw new IllegalArgumentException("PaymentInfo cannot be null");
        }

        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("receipt_email", paymentInfo.getReceiptEmail());
        return PaymentIntent.create(params);
    }

    // Utility method to generate a tracking number
    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
