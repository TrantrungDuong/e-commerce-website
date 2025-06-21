package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.request.BrandRequest;
import com.devteria.identityservice.dto.response.BrandResponse;
import com.devteria.identityservice.entity.Brand;
import com.devteria.identityservice.mapper.BrandMapper;
import com.devteria.identityservice.repository.BrandRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BrandService {
    BrandRepository brandRepository;
    BrandMapper brandMapper;

    // Create new brand
    public BrandResponse createBrand(BrandRequest request){
        Brand brand = brandMapper.toBrand(request);
        return brandMapper.toBrandResponse(brandRepository.save(brand));
    }

    // Get all brands
    public List<BrandResponse> getAll() {
        List<Brand> brands = brandRepository.findAll();
//        brands.stream().map(brand -> brandMapper.toBrandResponse(brand)).toList();
        return brands.stream().map(brandMapper::toBrandResponse).toList();
    }

    // delete brand
    public void deleteBrand(String name){
        brandRepository.deleteById(name);
    }
}
