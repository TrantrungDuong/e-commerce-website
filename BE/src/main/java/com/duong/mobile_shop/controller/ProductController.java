package com.duong.mobile_shop.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.duong.mobile_shop.dto.request.ApiResponse;
import com.duong.mobile_shop.dto.request.ProductCreationRequest;
import com.duong.mobile_shop.dto.request.ProductUpdateRequest;
import com.duong.mobile_shop.dto.response.MonthlyRevenueResponse;
import com.duong.mobile_shop.dto.response.ProductResponse;
import com.duong.mobile_shop.dto.response.TopSellingResponse;
import com.duong.mobile_shop.service.ProductService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductController {

    ProductService productService;

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(
            @ModelAttribute ProductCreationRequest request, @RequestParam("images") MultipartFile[] images) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.createProduct(request, images))
                .build();
    }

    @PutMapping(value = "/{id}")
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable Long id,
            @ModelAttribute ProductUpdateRequest request,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {

        return ApiResponse.<ProductResponse>builder()
                .result(productService.updateProduct(id, request, images))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.<Void>builder()
                .message("Product deleted successfully")
                .build();
    }

    @GetMapping("/search-products")
    public ApiResponse<List<ProductResponse>> searchProducts(@RequestParam String name) {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.searchByProduct(name))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long id) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getProduct(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getAllProducts())
                .build();
    }

    @GetMapping("/filter/price/asc")
    public ApiResponse<List<ProductResponse>> getProductsByPriceAsc() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getProductsByPriceAsc())
                .build();
    }

    @GetMapping("/filter/price/desc")
    public ApiResponse<List<ProductResponse>> getProductsByPriceDesc() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getProductsByPriceDesc())
                .build();
    }

    @GetMapping("/filter/by-brand")
    public ApiResponse<List<ProductResponse>> getProductsByBrand(@RequestParam String brandName) {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getProductsByBrand(brandName))
                .build();
    }

    @GetMapping("/top-selling")
    public ApiResponse<List<TopSellingResponse>> getTopSellingProducts() {
        return ApiResponse.<List<TopSellingResponse>>builder()
                .result(productService.getTopSellingProducts())
                .build();
    }

    @GetMapping("/monthly")
    public ApiResponse<List<MonthlyRevenueResponse>> getMonthlyRevenue() {
        return ApiResponse.<List<MonthlyRevenueResponse>>builder()
                .result(productService.getMonthlyRevenue())
                .build();
    }

    @GetMapping("/media/{filename}")
    public ResponseEntity<?> getMedia(@PathVariable String filename) {
        return productService.getMedia(filename);
    }
}
