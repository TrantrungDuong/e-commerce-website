package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.response.FileInfo;
import com.devteria.identityservice.entity.FileManagement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FileManagementMapper {
    @Mapping(target = "id", source = "name")
    FileManagement toFileManagement(FileInfo fileInfo);
}
