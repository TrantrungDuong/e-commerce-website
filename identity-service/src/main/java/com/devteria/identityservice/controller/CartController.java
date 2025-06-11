package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.ApiResponse;
import com.devteria.identityservice.dto.request.CartItemRequest;
import com.devteria.identityservice.dto.response.CartItemResponse;
import com.devteria.identityservice.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {

    CartService cartService;

    @GetMapping
    public ApiResponse<List<CartItemResponse>> getCartItems() {
        return ApiResponse.<List<CartItemResponse>>builder()
                .result(cartService.getCartItems())
                .build();
    }

    @PostMapping("/add")
    public ApiResponse<Void> addToCart(@RequestBody CartItemRequest request) {
        cartService.addToCart(request);
        return ApiResponse.<Void>builder().build();
    }

    @PutMapping("/update")
    public ApiResponse<Void> updateQuantity(@RequestBody CartItemRequest request) {
        cartService.updateQuantity(request);
        return ApiResponse.<Void>builder().build();
    }

    @DeleteMapping("/remove/{productId}")
    public ApiResponse<Void> removeFromCart(@PathVariable Long productId) {
        cartService.removeFromCart(productId);
        return ApiResponse.<Void>builder().build();
    }
}
