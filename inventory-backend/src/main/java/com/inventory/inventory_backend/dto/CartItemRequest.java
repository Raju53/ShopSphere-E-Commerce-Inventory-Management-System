package com.inventory.inventory_backend.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class CartItemRequest {
    private Long productId;
    private Integer quantity;
}