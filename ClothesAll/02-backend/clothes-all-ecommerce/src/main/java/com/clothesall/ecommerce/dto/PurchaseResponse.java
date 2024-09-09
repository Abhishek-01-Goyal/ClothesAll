package com.clothesall.ecommerce.dto;

import lombok.Data;
import lombok.NonNull;

@Data
@NonNull
public final class PurchaseResponse {

    private String orderTrackingNumber;

    public PurchaseResponse(String orderTrackingNumber) {
        this.orderTrackingNumber = orderTrackingNumber;
    }
}
