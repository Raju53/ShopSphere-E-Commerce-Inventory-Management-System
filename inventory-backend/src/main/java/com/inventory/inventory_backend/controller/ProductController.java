package com.inventory.inventory_backend.controller;

import com.inventory.inventory_backend.dto.ProductResponse;
import com.inventory.inventory_backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.inventory.inventory_backend.dto.ProductRequest;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * USER -> View products (with pagination)
     * Matches Service: getProducts(int page, int size)
     */
    @GetMapping("/user/products")
    public Page<ProductResponse> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return productService.getProducts(page, size);
    }

    /**
     * SUPPLIER -> Add product
     * FIXED: Changed 'Product' entity to 'ProductRequest' DTO to match
     * ServiceClasses.java
     */
    @PostMapping("/supplier/products")
    public ProductResponse addProduct(
            @RequestBody ProductRequest request,
            Authentication authentication) {

        return productService.createProduct(
                request,
                authentication.getName());
    }

    // SUPPLIER -> Update
    @PutMapping("/supplier/products/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {

        return productService.updateProduct(id, request);
    }

    /**
     * SUPPLIER -> Delete product
     */
    @DeleteMapping("/supplier/products/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "Product deleted successfully";
    }
}