package com.fyp.hca.controller;

import com.fyp.hca.entity.District;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.services.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/district")
public class DistrictController {

    private final DistrictService districtService;

    @Autowired
    public DistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addDistrict(@RequestBody District district){
        try {
            districtService.addDistrict(district);
            return ResponseEntity.status(HttpStatus.CREATED).body("District added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while adding district");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<District>> getDistrict(){
        List<District> districts = districtService.getDistrict();
        return ResponseEntity.ok().body(districts);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDistrictById(@PathVariable Integer id){
        Optional<District> district = districtService.getDistrictById(id);
        if (district.isPresent()) {
            return ResponseEntity.ok().body(district.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: District not found");
        }
    }

    @GetMapping("/getIdAndName")
    public ResponseEntity<?> getDistrictIdAndName(){
        List<Map<String, Object>> result = districtService.getDistrictIdAndName();
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDistrict(@PathVariable Integer id){
        try {
            if (districtService.isDistrictAssociated(id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete District. It is associated with something.");
            }
            districtService.deleteDistrict(id);
            return ResponseEntity.status(HttpStatus.OK).body("District deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while deleting district");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateDistrict(@RequestBody District district){
        try {
            districtService.updateDistrict(district);
            return ResponseEntity.status(HttpStatus.OK).body("District updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while updating district");
        }
    }

    @GetMapping("/getDistrictsByDivisionIds")
    public ResponseEntity<List<Map<String, Object>>> getDistrictsByDivisionIds(@RequestParam  List<Integer> divisionIds) {
        try {
            List<Map<String, Object>> districts = districtService.getDistrictIdAndNameByDivisionIds(divisionIds);
            return ResponseEntity.ok().body(districts);
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
        PaginatedResponse<District> result = districtService.getTableData(start, size, filters, sorting,globalFilter);
        return ResponseEntity.ok().body(result);
    }

}
