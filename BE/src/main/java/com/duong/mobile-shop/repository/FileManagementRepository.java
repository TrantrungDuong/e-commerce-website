package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.FileManagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileManagementRepository extends JpaRepository<FileManagement, String> {

}
