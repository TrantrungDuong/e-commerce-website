package com.duong.mobile_shop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.duong.mobile_shop.dto.request.RoleRequest;
import com.duong.mobile_shop.dto.response.RoleResponse;
import com.duong.mobile_shop.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
