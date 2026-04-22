package com.inventory.inventory_backend.repository;

import com.inventory.inventory_backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);

    List<Product> findByNameContainingIgnoreCase(String name);

    Page<Product> findBySupplierUsername(String username, Pageable pageable);

    Long countBySupplierId(Long supplierId);
}
