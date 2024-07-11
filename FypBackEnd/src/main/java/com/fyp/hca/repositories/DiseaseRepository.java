package com.fyp.hca.repositories;

import com.fyp.hca.entity.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface DiseaseRepository extends JpaRepository<Disease, Integer>, JpaSpecificationExecutor<Disease>{
    @Query("SELECT d.id as id, d.name as name FROM Disease d")
    List<Map<String, Object>> findDiseaseIdAndName();

}