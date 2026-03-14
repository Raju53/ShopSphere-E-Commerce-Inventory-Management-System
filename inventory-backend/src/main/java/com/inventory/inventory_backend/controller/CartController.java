package com.inventory.inventory_backend.controller;

import com.inventory.inventory_backend.dto.CartResponse;
import com.inventory.inventory_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // Add to Cart
    @PostMapping("/{productId}")
    public CartResponse addToCart(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") int quantity,
            Authentication authentication) {

        return cartService.addToCart(
                productId,
                quantity,
                authentication.getName());
    }

    // View Cart
    @GetMapping
    public List<CartResponse> viewCart(Authentication authentication) {

        return cartService.getUserCart(authentication.getName());
    }

    // Remove
    @DeleteMapping("/{cartId}")
    public String removeFromCart(@PathVariable Long cartId) {

        cartService.removeFromCart(cartId);
        return "Item removed from cart";
    }
}