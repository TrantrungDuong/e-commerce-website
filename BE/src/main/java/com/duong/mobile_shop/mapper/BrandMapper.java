package com.duong.mobile_shop.mapper;

import com.duong.mobile_shop.dto.request.BrandRequest;
import com.duong.mobile_shop.dto.response.BrandResponse;
import com.duong.mobile_shop.entity.Brand;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    Brand toBrand(BrandRequest request);

    BrandResponse toBrandResponse(Brand brand);

}
