package com.inventory.inventory_backend.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String category;
    private String imageUrl;
    private String supplierName;
    private String supplierCompanyName;
}