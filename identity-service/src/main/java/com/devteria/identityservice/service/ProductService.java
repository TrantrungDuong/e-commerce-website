package com.devteria.identityservice.service;


import com.devteria.identityservice.dto.request.ProductCreationRequest;
import com.devteria.identityservice.dto.request.ProductUpdateRequest;
import com.devteria.identityservice.dto.response.ProductResponse;
import com.devteria.identityservice.entity.Brand;
import com.devteria.identityservice.entity.Product;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.ProductMapper;
import com.devteria.identityservice.repository.BrandRepository;
import com.devteria.identityservice.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductService {

    ProductRepository productRepository;
    ProductMapper productMapper;
    BrandRepository brandRepository;

    public ProductResponse createProduct(ProductCreationRequest request) {
        Product product = productMapper.toProduct(request);
        String brandName = request.getBrandName();
        Optional<Brand> optionalBrand = brandRepository.findById(brandName);
        if (optionalBrand.isPresent()) {
            product.setBrand(optionalBrand.get());
        } else {
            throw new AppException(ErrorCode.BRAND_NOT_FOUND);
        }
        Product savedProduct = productRepository.save(product);
        return productMapper.toProductResponse(savedProduct);
    }

    // Update product
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        var product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

       productMapper.updateProduct(product, request);
        Product updatedProduct = productRepository.save(product);
        return productMapper.toProductResponse(updatedProduct);
    }

    // Delete product
    public void deleteProduct(Long productId) {
        boolean exists = productRepository.existsById(productId);
        if (!exists) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        productRepository.deleteById(productId);
    }

    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toProductResponse(product);
    }

    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    // Lọc sản phẩm theo giá tăng dần
    public List<ProductResponse> getProductsByPriceAsc() {
        List<Product> products = productRepository.findAllByOrderByPriceAsc();
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    // Lọc sản phẩm theo giá giảm dần
    public List<ProductResponse> getProductsByPriceDesc() {
        List<Product> products = productRepository.findAllByOrderByPriceDesc();
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }











}
