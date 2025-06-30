package com.duong.mobile_shop.mapper;

import org.mapstruct.Mapper;

import com.duong.mobile_shop.dto.request.PermissionRequest;
import com.duong.mobile_shop.dto.response.PermissionResponse;
import com.duong.mobile_shop.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
