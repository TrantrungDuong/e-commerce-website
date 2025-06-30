package com.duong.mobile_shop.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {

    Long id;

    String name;

    Double price;

    List<String> imageUrl;

    String storage;

    String ram;

    String battery;

    String color;

    String brandName;
}
