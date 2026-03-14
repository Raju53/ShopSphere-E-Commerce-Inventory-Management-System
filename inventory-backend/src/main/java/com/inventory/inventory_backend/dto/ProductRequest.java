package com.inventory.inventory_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank
    @Size(max = 100)
    private String name;
    private String description;
    @NotNull
    @Positive
    private Double price;
    @NotNull
    @PositiveOrZero
    private Integer stock;
    @NotBlank
    private String category;
    private String imageUrl;
}