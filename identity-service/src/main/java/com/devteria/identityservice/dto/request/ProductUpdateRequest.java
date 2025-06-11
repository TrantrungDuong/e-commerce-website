package com.devteria.identityservice.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {

    String name;

    Double price;

    List<String> imageUrl;

    String storage;

    String ram;

    String battery;

    String color;

}
