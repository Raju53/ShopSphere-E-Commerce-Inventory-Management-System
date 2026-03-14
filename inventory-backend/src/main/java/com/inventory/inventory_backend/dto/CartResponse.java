package com.inventory.inventory_backend.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@Data
public class CartResponse {

    private Long cartId;
    private Long productId;
    private String productName;
    private Double price;
    private Integer quantity;
    private Double totalPrice;
}