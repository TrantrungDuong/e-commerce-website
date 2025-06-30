package com.duong.mobile_shop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.duong.mobile_shop.dto.request.ProductCreationRequest;
import com.duong.mobile_shop.dto.request.ProductUpdateRequest;
import com.duong.mobile_shop.dto.response.ProductResponse;
import com.duong.mobile_shop.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    Product toProduct(ProductCreationRequest request);

    @Mapping(source = "brand.name", target = "brandName")
    ProductResponse toProductResponse(Product product);

    void updateProduct(@MappingTarget Product product, ProductUpdateRequest request);
}
