package com.duong.mobile_shop.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    Long id;
    Long productId;
    String productName;
    String username;
    int rating;
    String comment;
    LocalDateTime createdAt;
}
