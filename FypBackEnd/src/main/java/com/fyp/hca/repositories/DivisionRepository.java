package com.fyp.hca.repositories;

import com.fyp.hca.entity.District;
import com.fyp.hca.entity.Division;
import com.fyp.hca.entity.Province;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface DivisionRepository extends JpaRepository<Division, Integer> , JpaSpecificationExecutor<Division> {

    @Query("SELECT t.id as id, t.name as name FROM Division t")
    List<Map<String, Object>> findDivisionIdAndName();

    @Query("SELECT t.id as id, t.name as name FROM Division t WHERE t.province.id IN :provinceIds")
    List<Map<String, Object>> findDivisionIdAndNameByProvinceIds(List<Integer> provinceIds);

    @Query("SELECT d  FROM Division d WHERE d.province.id = :provinceId")
    List<Division> findAllByProvinceId(Integer provinceId, Sort id);
}
