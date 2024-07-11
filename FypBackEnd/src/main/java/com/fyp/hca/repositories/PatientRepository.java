package com.fyp.hca.repositories;

import com.fyp.hca.entity.*;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer>, JpaSpecificationExecutor<Patient> {
    long countByDiseaseId(int diseaseId);

    long countByHospitalId(Integer hospitalId);

    @Query("SELECT p FROM Patient p WHERE p.hospital.tehsil.id = :tehsilId")
    List<Patient> findByTehsilId(@Param("tehsilId") Integer tehsilId, Sort sort);

    @Query("SELECT p FROM Patient p WHERE p.hospital.tehsil.district.id = :districtId")
    List<Patient> findByDistrictId(@Param("districtId") Integer districtId, Sort sort);

    @Query("SELECT p FROM Patient p WHERE p.hospital.tehsil.district.division.id = :divisionId")
    List<Patient> findByDivisionId(@Param("divisionId") Integer divisionId, Sort sort);

    @Query("SELECT p FROM Patient p WHERE p.hospital.tehsil.district.division.province.id = :provinceId")
    List<Patient> findByProvinceId(@Param("provinceId") Integer provinceId, Sort sort);

    @Query("SELECT p FROM Patient p WHERE p.hospital.id = :hospitalId")
    List<Patient> findByHospitalId(@Param("hospitalId") Integer hospitalId, Sort sort);

    @Query("SELECT p FROM Patient p WHERE p.hospital.id = :hospitalId")
    List<Patient> findByHospitalId(@Param("hospitalId") Integer hospitalId);

    @Query("SELECT count(*) FROM Patient p WHERE p.disease.id = :diseaseId")
    int CountbyDiseaseId(Integer diseaseId);
}
