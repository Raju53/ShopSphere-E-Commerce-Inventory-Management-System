package com.inventory.inventory_backend.service;

import com.inventory.inventory_backend.dto.ProductRequest;
import com.inventory.inventory_backend.dto.ProductResponse;
import com.inventory.inventory_backend.entity.Product;
import com.inventory.inventory_backend.entity.User;
import com.inventory.inventory_backend.exception.ResourceNotFoundException;
import com.inventory.inventory_backend.repository.ProductRepository;
import com.inventory.inventory_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // Matches ProductController -> getProducts
    public Page<ProductResponse> getProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return productRepository.findAll(pageable)
                .map(this::mapToProductResponse);
    }

    public Page<ProductResponse> getSupplierProducts(int page, int size, String username) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        return productRepository.findBySupplierUsername(username, pageable)
                .map(this::mapToProductResponse);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public ProductResponse createProduct(ProductRequest request, String supplierUsername) {
        User supplier = userRepository.findByUsername(supplierUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .supplier(supplier)
                .build();

        return mapToProductResponse(productRepository.save(product));
    }

    public ProductResponse createProductByAdmin(ProductRequest request, String adminUsername) {
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .supplier(admin) // Admin acts as the creator/supplier
                .build();

        return mapToProductResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());

        return mapToProductResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .supplierName(product.getSupplier() != null ? product.getSupplier().getUsername() : "Unknown")
                .supplierCompanyName(
                        product.getSupplier() != null ? product.getSupplier().getCompanyName() : "Independent Seller")
                .build();
    }
}
