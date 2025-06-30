package com.duong.mobile_shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duong.mobile_shop.entity.FileManagement;

@Repository
public interface FileManagementRepository extends JpaRepository<FileManagement, String> {}
