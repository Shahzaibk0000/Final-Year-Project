package com.fyp.hca.controller;

import com.fyp.hca.entity.Tehsil;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.services.TehsilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tehsil")
public class TehsilController {
    private final TehsilService tehsilService;

    @Autowired
    public TehsilController(TehsilService tehsilService) {
        this.tehsilService = tehsilService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addTehsil(@RequestBody Tehsil tehsil){
        try {
            tehsilService.addTehsil(tehsil);
            return ResponseEntity.status(HttpStatus.CREATED).body("Tehsil added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while adding tehsil");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<Tehsil>> getTehsil(){
        List<Tehsil> tehsils = tehsilService.getTehsil();
        return ResponseEntity.ok().body(tehsils);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getTehsilById(@PathVariable Integer id){
        Optional<Tehsil> tehsil = tehsilService.getTehsilById(id);
        if (tehsil.isPresent()) {
            return ResponseEntity.ok().body(tehsil.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Tehsil not found");
        }
    }

    @GetMapping("/getIdAndName")
    public ResponseEntity<?> getTehsilIdAndName(){
        List<Map<String, Object>> result = tehsilService.getTehsilIdAndName();
        return ResponseEntity.ok().body(result);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTehsil(@PathVariable Integer id){
        try {
            if (tehsilService.isTehsilAssociated(id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete Tehsil. It is associated with Hospital or User.");
            }
            tehsilService.deleteTehsil(id);
            return ResponseEntity.status(HttpStatus.OK).body("Tehsil deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while deleting tehsil");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateTehsil(@RequestBody Tehsil tehsil){
        try {
            tehsilService.updateTehsil(tehsil);
            return ResponseEntity.status(HttpStatus.OK).body("Tehsil updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while updating tehsil");
        }
    }

    @GetMapping("/getTehsilsByDistrictIds")
    public ResponseEntity<List<Map<String, Object>>> getTehsilsByDistrictIds(@RequestParam List<Integer> districtIds) {
        try {
            List<Map<String, Object>> tehsils = tehsilService.getTehsilIdAndNameByDistrictIds(districtIds);
            return ResponseEntity.ok().body(tehsils);
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
        PaginatedResponse<Tehsil> result = tehsilService.getTableData(start, size, filters, sorting,globalFilter);
        return ResponseEntity.ok().body(result);
    }

}
