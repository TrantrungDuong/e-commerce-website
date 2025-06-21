package com.duong.mobile_shop.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileManagement {
    @Id
    String id;
    String contentType;
    long size;
    String md5Checksum;
    String path;
}
