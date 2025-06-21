package com.duong.mobile_shop.mapper;


import com.duong.mobile_shop.dto.response.FileInfo;
import com.duong.mobile_shop.entity.FileManagement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FileManagementMapper {
    @Mapping(target = "id", source = "name")
    FileManagement toFileManagement(FileInfo fileInfo);
}
