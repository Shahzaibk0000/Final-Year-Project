package com.fyp.hca.controller;

import com.fyp.hca.entity.Hospital;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.services.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/hospital")
public class HospitalController {

    private final HospitalService hospitalService;

    @Autowired
    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }
    @PostMapping("/add")
    public ResponseEntity<String> addHospital(@RequestBody Hospital hospital) {
        try {
            hospitalService.addHospital(hospital);
            return ResponseEntity.status(HttpStatus.CREATED).body("Hospital added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while adding hospital");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<Hospital>> getHospitals() {
        List<Hospital> hospitals = hospitalService.getHospitals();
        return ResponseEntity.ok().body(hospitals);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getHospitalById(@PathVariable Integer id) {
        Optional<Hospital> hospital = hospitalService.getHospitalById(id);
        if (hospital.isPresent()) {
            return ResponseEntity.ok().body(hospital.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Hospital not found");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteHospital(@PathVariable Integer id) {
        try {
            if (hospitalService.isHospitalAssociated(id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete Hospital. It is associated with patients or users.");
            }
            hospitalService.deleteHospital(id);
            return ResponseEntity.status(HttpStatus.OK).body("Hospital deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while deleting hospital");
        }
    }


    @PutMapping("/update")
    public ResponseEntity<String> updateHospital(@RequestBody Hospital hospital) {
        try {
            hospitalService.updateHospital(hospital);
            return ResponseEntity.status(HttpStatus.OK).body("Hospital updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while updating hospital");
        }
    }

    @GetMapping("/getIdAndName")
    public ResponseEntity<?> getHospitalIdAndName() {
        List<Map<String, Object>> hospitals = hospitalService.getHospitalIdAndName();
        return ResponseEntity.ok().body(hospitals);
    }

    @GetMapping("/getHospitalsByTehsilIds")
    public ResponseEntity<List<Map<String, Object>>> getHospitalsByTehsilIds(@RequestParam List<Integer> tehsilIds) {
        try {
            List<Map<String, Object>> hospitals = hospitalService.getHospitalIdAndNameByTehsilIds(tehsilIds);
            return ResponseEntity.ok().body(hospitals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getTableData")
    public ResponseEntity<?> getTableData(
            @RequestParam("start") int start,
            @RequestParam("size") int size,
            @RequestParam("filters") String filters,
            @RequestParam("sorting") String sorting,
            @RequestParam("globalFilter") String globalFilter
    ) {
        PaginatedResponse<Hospital> result = hospitalService.getTableData(start, size, filters, sorting,globalFilter);
        return ResponseEntity.ok().body(result);
    }
}
