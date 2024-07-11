package com.fyp.hca.repositories;

import com.fyp.hca.entity.Province;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Integer>, JpaSpecificationExecutor<Province> {
    @Query("SELECT p.id as id, p.name as name FROM Province p")
    List<Map<String, Object>> findProvinceIdAndName();
    @Query("SELECT p.id as id, p.name as name FROM Province p where p.id=:provinceId")
    List<Map<String, Object>> findProvinceIdAndNameById(Integer provinceId);
}
