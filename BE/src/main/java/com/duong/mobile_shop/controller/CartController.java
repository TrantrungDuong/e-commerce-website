package com.duong.mobile_shop.controller;

import org.springframework.web.bind.annotation.*;

import com.duong.mobile_shop.dto.request.ApiResponse;
import com.duong.mobile_shop.dto.request.CartItemRequest;
import com.duong.mobile_shop.dto.response.CartResponse;
import com.duong.mobile_shop.service.CartService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {

    CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getCartItems() {
        return ApiResponse.<CartResponse>builder()
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
