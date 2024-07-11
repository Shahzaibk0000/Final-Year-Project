package com.fyp.hca.repositories;

import com.fyp.hca.entity.Tehsil;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface TehsilRepository extends JpaRepository<Tehsil, Integer>, JpaSpecificationExecutor<Tehsil> {
    @Query("SELECT t.id as id, t.name as name FROM Tehsil t")
    List<Map<String, Object>> findTehsilIdAndName();

    long countByDistrictId(Integer districtId);

    @Query("SELECT t.id as id, t.name as name FROM Tehsil t WHERE t.district.id IN :districtIds")
    List<Map<String, Object>> findTehsilIdAndNameByDistrictIds(List<Integer> districtIds);

    @Query("SELECT t  FROM Tehsil t WHERE t.district.division.id = :divisionId")
    List<Tehsil> findAllByDivisionId(Integer divisionId, Sort sort);

    @Query("SELECT t  FROM Tehsil t WHERE t.district.division.province.id = :provinceId")
    List<Tehsil> findAllByProvinceId(Integer provinceId, Sort sort);
}