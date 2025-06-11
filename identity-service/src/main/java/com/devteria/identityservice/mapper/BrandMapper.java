package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.BrandRequest;
import com.devteria.identityservice.dto.request.UserUpdateRequest;
import com.devteria.identityservice.dto.response.BrandResponse;
import com.devteria.identityservice.entity.Brand;
import com.devteria.identityservice.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    Brand toBrand(BrandRequest request);

    BrandResponse toBrandResponse(Brand brand);

}
