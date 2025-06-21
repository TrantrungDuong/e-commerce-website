package com.duong.mobile_shop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS(1009, "Invalid credentials, please try again.", HttpStatus.BAD_REQUEST),
    BRAND_NOT_FOUND(1010, "Brand not found", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND(1011, "Product not found", HttpStatus.NOT_FOUND),
    CART_EMPTY(1012, "cart is empty", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND(1013, "order not found", HttpStatus.NOT_FOUND),
    CANNOT_CANCEL_ORDER(1014, "can not cancel order", HttpStatus.BAD_REQUEST),
    WISHLIST_ITEM_NOT_FOUND(1015, "with list item not found", HttpStatus.NOT_FOUND),
    REVIEW_NOT_ALLOWED(1016, "review not allowed", HttpStatus.BAD_REQUEST),
    REVIEW_NOT_FOUND(1017, "review not found", HttpStatus.NOT_FOUND),
    REVIEW_ALREADY_EXISTS(1018,"review already existed", HttpStatus.BAD_REQUEST),
    UPLOAD_FAILED(1019,"upload file failed", HttpStatus.BAD_REQUEST),







    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
