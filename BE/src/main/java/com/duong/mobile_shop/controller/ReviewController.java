package com.duong.mobile_shop.controller;

import com.duong.mobile_shop.dto.request.ApiResponse;
import com.duong.mobile_shop.dto.request.ReviewRequest;
import com.duong.mobile_shop.dto.response.ReviewResponse;
import com.duong.mobile_shop.service.ReviewService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ReviewController {

    ReviewService reviewService;

    // send review
    @PostMapping
    public ApiResponse<Void> submitReview(@RequestBody ReviewRequest request) {
        reviewService.submitReview(request);
        return ApiResponse.<Void>builder().build();
    }

    // get reviews list by product
    @GetMapping("/{productId}")
    public ApiResponse<List<ReviewResponse>> getReviewsByProduct(@PathVariable Long productId) {
        log.info("🎯 Controller called - productId: {}", productId);
        List<ReviewResponse> reviews = reviewService.getReviewsByProduct(productId);
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviews)
                .build();
    }

    // update review
    @PutMapping("/{reviewId}")
    public ApiResponse<Void> updateReview(@PathVariable Long reviewId,
                                          @RequestBody ReviewRequest request) {
        reviewService.updateReview(reviewId, request);
        return ApiResponse.<Void>builder().build();
    }

    // delete review
    @DeleteMapping("/{reviewId}")
    public ApiResponse<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ApiResponse.<Void>builder().build();
    }

}
