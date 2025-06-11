package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.ApiResponse;
import com.devteria.identityservice.dto.response.WishlistResponse;
import com.devteria.identityservice.service.WishlistService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class WishlistController {

    WishlistService wishlistService;

    // add product to wishlist
    @PostMapping("/{productId}")
    public ApiResponse<Void> addToWishlist(@PathVariable Long productId) {
        wishlistService.addToWishlist(productId);
        return ApiResponse.<Void>builder().build();
    }

    // delete product from wishlist
    @DeleteMapping("/{productId}")
    public ApiResponse<Void> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(productId);
        return ApiResponse.<Void>builder().build();
    }

    // get user's current wishlist
    @GetMapping
    public ApiResponse<List<WishlistResponse>> getMyWishlist() {
        return ApiResponse.<List<WishlistResponse>>builder()
                .result(wishlistService.getMyWishlist())
                .build();
    }
}
