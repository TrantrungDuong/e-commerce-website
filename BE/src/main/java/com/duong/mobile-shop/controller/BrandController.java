package com.devteria.identityservice.controller;


import com.devteria.identityservice.dto.request.ApiResponse;
import com.devteria.identityservice.dto.request.BrandRequest;
import com.devteria.identityservice.dto.response.BrandResponse;
import com.devteria.identityservice.service.BrandService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BrandController {

    BrandService brandService;

    @PostMapping()
    ApiResponse<BrandResponse> createBrand(@RequestBody BrandRequest request){
        return ApiResponse.<BrandResponse>builder()
                .result(brandService.createBrand(request))
                .build();
    }

    @GetMapping()
    ApiResponse<List<BrandResponse>> getAllBrand(){
        return ApiResponse.<List<BrandResponse>>builder()
                .result(brandService.getAll())
                .build();
    }

    @DeleteMapping("/{brandName}")
    ApiResponse<Void> deleteBrand(@PathVariable("brandName") String brandName){
        brandService.deleteBrand(brandName);
        return ApiResponse.<Void>builder().build();
    }

}
