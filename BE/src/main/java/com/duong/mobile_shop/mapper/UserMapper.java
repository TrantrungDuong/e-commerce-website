package com.duong.mobile_shop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.duong.mobile_shop.dto.request.UserCreationRequest;
import com.duong.mobile_shop.dto.request.UserUpdateRequest;
import com.duong.mobile_shop.dto.response.UserResponse;
import com.duong.mobile_shop.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
