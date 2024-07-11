package com.fyp.hca.controller;

import com.fyp.hca.entity.Division;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.services.DivisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/division")
public class DivisionController {

    private final DivisionService divisionService;

    @Autowired
    public DivisionController(DivisionService divisionService) {
        this.divisionService = divisionService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addDivision(@RequestBody Division division) {
        try {
            divisionService.addDivision(division);
            return ResponseEntity.status(HttpStatus.CREATED).body("Division added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while adding division");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<Division>> getDivision() {
        List<Division> divisions = divisionService.getDivision();
        return ResponseEntity.ok().body(divisions);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDivisionById(@PathVariable Integer id) {
        Optional<Division> division = divisionService.getDivisionById(id);
        if (division.isPresent()) {
            return ResponseEntity.ok().body(division.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Division not found");
        }
    }

    @GetMapping("/getIdAndName")
    public ResponseEntity<?> getDivisionIdAndName() {
        List<Map<String, Object>> divisions = divisionService.getDivisionIdAndName();
        return ResponseEntity.ok().body(divisions);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDivision(@PathVariable Integer id) {
        try {
            if (divisionService.isDivisionAssociated(id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete Division. It is associated with something.");
            }
            divisionService.deleteDivision(id);
            return ResponseEntity.status(HttpStatus.OK).body("Division deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while deleting division");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateDivision(@RequestBody Division division) {
        try {
            divisionService.updateDivision(division);
            return ResponseEntity.status(HttpStatus.OK).body("Division updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while updating division");
        }
    }
    @GetMapping("/getDivisionsByProvinceIds")
    public ResponseEntity<List<Map<String, Object>>> getDivisionsByProvinceIds(@RequestParam List<Integer> provinceIds) {
        try {
            List<Map<String, Object>> divisions = divisionService.getDivisionByProvinceIds(provinceIds);
            return ResponseEntity.ok().body(divisions);
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
        PaginatedResponse<Division> result = divisionService.getTableData(start, size, filters, sorting,globalFilter);
        return ResponseEntity.ok().body(result);
    }
}
