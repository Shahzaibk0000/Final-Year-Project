package com.fyp.hca.controller;

import com.fyp.hca.entity.Disease;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.services.DiseaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/disease")
public class DiseaseController {
    private final DiseaseService diseaseService;

    @Autowired
    public DiseaseController(DiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addDisease(@RequestBody Disease disease) {
        try {
            diseaseService.addDisease(disease);
            return ResponseEntity.status(HttpStatus.CREATED).body("Disease added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while adding disease");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<Disease>> getDisease() {
        List<Disease> diseases = diseaseService.getDiseases();
        return ResponseEntity.ok().body(diseases);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDisease(@PathVariable Integer id) {
        try {
            if (diseaseService.isDiseaseAssociated(id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete Disease. It is associated with patients.");
            }
            diseaseService.deleteDisease(id);
            return ResponseEntity.status(HttpStatus.OK).body("Disease deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while deleting disease");
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDivisionById(@PathVariable Integer id) {
        Optional<Disease> division = diseaseService.getDiseaseById(id);
        if (division.isPresent()) {
            return ResponseEntity.ok().body(division.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Disease not found");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateDisease(@RequestBody Disease disease) {
        try {
            diseaseService.updateDisease(disease);
            return ResponseEntity.status(HttpStatus.OK).body("Disease updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while updating disease");
        }
    }

    @GetMapping("/getIdAndName")
    public ResponseEntity<List<Map<String, Object>>> getDiseaseIdAndName() {
        try {
            List<Map<String, Object>> disease = diseaseService.getDiseaseIdAndName();
            return ResponseEntity.ok().body(disease);
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
        PaginatedResponse<Disease> result = diseaseService.getTableData(start, size, filters, sorting, globalFilter);
        return ResponseEntity.ok().body(result);
    }



}
