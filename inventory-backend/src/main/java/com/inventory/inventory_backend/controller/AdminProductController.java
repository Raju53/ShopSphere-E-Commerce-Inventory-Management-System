package com.inventory.inventory_backend.controller;

import com.inventory.inventory_backend.dto.ProductRequest;
import com.inventory.inventory_backend.dto.ProductResponse;
import com.inventory.inventory_backend.entity.Product;
import com.inventory.inventory_backend.service.ProductService;
import com.inventory.inventory_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    // ADMIN -> Add any product
    @PostMapping
    public ProductResponse addProductByAdmin(
            @RequestBody ProductRequest request,
            Authentication authentication) {

        return productService.createProductByAdmin(request, authentication.getName());
    }

    // ADMIN -> Update any product
    @PutMapping("/{id}")
    public ProductResponse updateProductByAdmin(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {

        return productService.updateProduct(id, request);
    }

    // ADMIN -> Delete any product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "Product deleted by Admin successfully";
    }
}