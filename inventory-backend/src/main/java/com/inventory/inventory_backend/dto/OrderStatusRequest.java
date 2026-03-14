package com.inventory.inventory_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusRequest {
    @NotBlank
    private String status; // e.g., "SHIPPED", "DELIVERED"
}
