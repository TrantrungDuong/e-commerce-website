package com.duong.mobile_shop.controller;

import java.util.List;
import java.util.Set;

import jakarta.validation.Valid;

import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.duong.mobile_shop.dto.request.ApiResponse;
import com.duong.mobile_shop.dto.request.UserCreationRequest;
import com.duong.mobile_shop.dto.request.UserUpdateRequest;
import com.duong.mobile_shop.dto.response.UserResponse;
import com.duong.mobile_shop.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {
    UserService userService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @GetMapping("/my-info")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @DeleteMapping("/{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted").build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }

    @GetMapping("/total-user")
    public ApiResponse<Long> getTotalUsers() {
        return ApiResponse.<Long>builder().result(userService.getTotalUsers()).build();
    }

    @PutMapping("/{userId}/roles")
    public ResponseEntity<ApiResponse<Void>> updateUserRoles(
            @PathVariable String userId, @RequestBody Set<String> roleNames)
            throws ChangeSetPersister.NotFoundException {

        userService.updateUserRoles(userId, roleNames);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("User roles updated successfully")
                .build();

        return ResponseEntity.ok(response);
    }
}
