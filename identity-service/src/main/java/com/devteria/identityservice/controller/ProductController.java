package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.ApiResponse;
import com.devteria.identityservice.dto.request.ProductCreationRequest;
import com.devteria.identityservice.dto.request.ProductUpdateRequest;
import com.devteria.identityservice.dto.response.ProductResponse;
import com.devteria.identityservice.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductController {

    ProductService productService;

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@RequestBody ProductCreationRequest request){
        return ApiResponse.<ProductResponse>builder()
                .result(productService.createProduct(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Long id, @RequestBody ProductUpdateRequest request){
        return ApiResponse.<ProductResponse>builder()
                .result(productService.updateProduct(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
        return ApiResponse.<Void>builder()
                .message("Product deleted successfully")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long id){
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getProduct(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts(){
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getAllProducts())
                .build();
    }

    // Lọc theo giá tăng dần (thấp đến cao)
    @GetMapping("/filter/price/asc")
    public ApiResponse<List<ProductResponse>> getProductsByPriceAsc() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getProductsByPriceAsc())
                .build();
    }

    // Lọc theo giá giảm dần (cao đến thấp)
    @GetMapping("/filter/price/desc")
    public ApiResponse<List<ProductResponse>> getProductsByPriceDesc() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getProductsByPriceDesc())
                .build();
    }

}
