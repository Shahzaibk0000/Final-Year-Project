package com.fyp.hca.repositories;

import com.fyp.hca.entity.District;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface DistrictRepository extends JpaRepository<District, Integer>, JpaSpecificationExecutor<District> {
    @Query("SELECT t.id as id, t.name as name FROM District t")
    List<Map<String, Object>> findDistrictIdAndName();

    long countByDivisionId(Integer divisionId);

    @Query("SELECT d.id as id, d.name as name FROM District d WHERE d.division.id IN :divisionIds")
    List<Map<String, Object>> findDistrictIdAndNameByDivisionIds(List<Integer> divisionIds);

    @Query("SELECT d  FROM District d WHERE d.division.province.id = :provinceId")
    List<District> findAllByProvinceId(Integer provinceId, Sort id);

    @Query("SELECT d  FROM District d WHERE d.division.id = :divisionId")
    List<District> findAllByDivisionId(Integer divisionId, Sort id);
}
