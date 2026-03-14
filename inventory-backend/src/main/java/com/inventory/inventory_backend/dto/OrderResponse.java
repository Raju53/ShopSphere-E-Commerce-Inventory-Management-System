package com.inventory.inventory_backend.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;
    private Double totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}