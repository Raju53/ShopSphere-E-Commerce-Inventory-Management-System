package com.inventory.inventory_backend.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class OrderItemResponse {

    private String productName;
    private Integer quantity;
    private Double price;
}