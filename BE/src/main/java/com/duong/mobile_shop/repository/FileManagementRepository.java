package com.duong.mobile_shop.repository;

import com.duong.mobile_shop.entity.FileManagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileManagementRepository extends JpaRepository<FileManagement, String> {

}
