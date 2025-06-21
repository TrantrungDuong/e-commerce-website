package com.duong.mobile_shop.mapper;

import com.duong.mobile_shop.dto.request.PermissionRequest;
import com.duong.mobile_shop.dto.response.PermissionResponse;
import com.duong.mobile_shop.entity.Permission;
import org.mapstruct.Mapper;



@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
