package com.duong.mobile_shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TopSellingResponse {

    Long productId;
    String productName;
    Double totalSold;
    String imageUrl;
}
