package com.duong.mobile_shop.service;



import com.duong.mobile_shop.dto.request.ProductCreationRequest;
import com.duong.mobile_shop.dto.request.ProductUpdateRequest;
import com.duong.mobile_shop.dto.response.FileResponse;
import com.duong.mobile_shop.dto.response.MonthlyRevenueResponse;
import com.duong.mobile_shop.dto.response.ProductResponse;
import com.duong.mobile_shop.dto.response.TopSellingResponse;
import com.duong.mobile_shop.entity.Brand;
import com.duong.mobile_shop.entity.Product;
import com.duong.mobile_shop.exception.AppException;
import com.duong.mobile_shop.exception.ErrorCode;
import com.duong.mobile_shop.mapper.FileManagementMapper;
import com.duong.mobile_shop.mapper.ProductMapper;
import com.duong.mobile_shop.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductService {

    ProductRepository productRepository;
    ProductMapper productMapper;
    BrandRepository brandRepository;
    OrderItemRepository orderItemRepository;
    OrderRepository orderRepository;
    FileRepository fileRepository;
    FileManagementRepository fileManagementRepository;
    FileManagementMapper fileManagementMapper;

    public ProductResponse createProduct(ProductCreationRequest request, MultipartFile[] images) {
        Product product = productMapper.toProduct(request);

        String brandName = request.getBrandName();
        Optional<Brand> optionalBrand = brandRepository.findById(brandName);
        if (optionalBrand.isPresent()) {
            product.setBrand(optionalBrand.get());
        } else {
            throw new AppException(ErrorCode.BRAND_NOT_FOUND);
        }

        List<String> imageUrls = Arrays.stream(images)
                .map(file -> {
                    try {
                        FileResponse response = uploadFile(file);
                        return response.getUrl();
                    } catch (IOException e) {
                        throw new AppException(ErrorCode.UPLOAD_FAILED);
                    }
                }).toList();

        product.setImageUrl(imageUrls);
        Product savedProduct = productRepository.save(product);
        return productMapper.toProductResponse(savedProduct);
    }

    // Update product
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request, MultipartFile[] images) {
        var product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

       productMapper.updateProduct(product, request);

        Optional<Brand> optionalBrand = brandRepository.findById(request.getBrandName());


        if (optionalBrand.isPresent()) {
            product.setBrand(optionalBrand.get());
        } else {
            throw new AppException(ErrorCode.BRAND_NOT_FOUND);
        }
        if (images != null && images.length > 0) {
            List<String> imageUrls = Arrays.stream(images)
                    .map(file -> {
                        try {
                            FileResponse response = uploadFile(file);
                            return response.getUrl();
                        } catch (IOException e) {
                            throw new AppException(ErrorCode.UPLOAD_FAILED);
                        }
                    }).toList();

            product.setImageUrl(new ArrayList<>(imageUrls));        }

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

    public List<ProductResponse> getProductsByPriceAsc() {
        List<Product> products = productRepository.findAllByOrderByPriceAsc();
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    public List<ProductResponse> getProductsByPriceDesc() {
        List<Product> products = productRepository.findAllByOrderByPriceDesc();
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    public List<ProductResponse> getProductsByBrand(String brandName) {
        List<Product> products = productRepository.findAllByBrand_NameIgnoreCase(brandName);
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }



    public List<TopSellingResponse> getTopSellingProducts() {
        List<Object[]> rows = orderItemRepository.findTopSellingProducts();

        return rows.stream()
                .map(row -> TopSellingResponse.builder()
                        .productId(((Number) row[0]).longValue())
                        .productName((String) row[1])
                        .totalSold(((Number) row[2]).doubleValue())
                        .imageUrl(row[3] != null ? row[3].toString() : null)
                        .build())
                .toList();
    }

    public List<MonthlyRevenueResponse> getMonthlyRevenue() {
        List<Object[]> results = orderRepository.findMonthlyRevenue();
        return results.stream()
                .map(row -> new MonthlyRevenueResponse(
                        ((Number) row[0]).intValue(),
                        ((Number) row[1]).intValue(),
                        ((Number) row[2]).doubleValue()
                ))
                .toList();
    }

    public List<ProductResponse> searchByProduct(String name) {
        var products = productRepository.findByNameContainingIgnoreCase(name);
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }




    public FileResponse uploadFile(MultipartFile file) throws IOException {
        var fileInfo = fileRepository.saveImage(file);
        var fileManagement = fileManagementMapper.
                toFileManagement(fileInfo);
        fileManagementRepository.save(fileManagement);

        return FileResponse.builder()
                .originalFileName(file.getOriginalFilename())
                .url(fileInfo.getUrl())
                .build();
    }


    public ResponseEntity<?> getMedia(String filename) {
        try {
            Resource resource = fileRepository.loadImage(filename);
            Path filePath = resource.getFile().toPath();

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Could not read file: " + filename);
        }
    }

}
