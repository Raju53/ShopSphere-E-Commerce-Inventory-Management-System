package com.inventory.inventory_backend.service;

import com.inventory.inventory_backend.dto.CartResponse;
import com.inventory.inventory_backend.entity.*;
import com.inventory.inventory_backend.exception.ResourceNotFoundException;
import com.inventory.inventory_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartResponse addToCart(Long productId, int quantity, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }

        Cart cart = cartRepository.findByUserAndProduct(user, product).orElse(null);

        if (cart != null) {
            cart.setQuantity(quantity);
        } else {
            cart = Cart.builder()
                    .user(user)
                    .product(product)
                    .quantity(quantity)
                    .build();
        }

        return mapToCartResponse(cartRepository.save(cart));
    }

    public List<CartResponse> getUserCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return cartRepository.findByUser(user).stream()
                .map(this::mapToCartResponse)
                .toList();
    }

    public void removeFromCart(Long cartId) {
        if (!cartRepository.existsById(cartId)) {
            throw new ResourceNotFoundException("Cart item not found");
        }
        cartRepository.deleteById(cartId);
    }

    private CartResponse mapToCartResponse(Cart cart) {
        return CartResponse.builder()
                .cartId(cart.getId())
                .productId(cart.getProduct().getId())
                .productName(cart.getProduct().getName())
                .price(cart.getProduct().getPrice())
                .quantity(cart.getQuantity())
                .totalPrice(cart.getProduct().getPrice() * cart.getQuantity())
                .build();
    }
}