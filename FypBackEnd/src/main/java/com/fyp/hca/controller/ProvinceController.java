package com.fyp.hca.controller;

import com.fyp.hca.entity.Province;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.services.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class ProvinceController {
    @Autowired
    ProvinceService provinceService;

    @PostMapping(value = "/province/add")
    public void addProvince(@RequestBody Province province){
        provinceService.addProvince(province);
    }

    @GetMapping(value = "/province/get")
    public List<Province> getProvince(){
        return provinceService.getProvince();
    }

    @GetMapping(value = "/province/get/{id}")
    public Optional<Province> getProvincById(@PathVariable Integer id){
        return provinceService.getProvinceById(id);
    }

    @GetMapping("province/getIdAndName")
    public ResponseEntity<?> getProvinceIdAndName(){
        List<Map<String, Object>> result = provinceService.getProvinceIdAndName();
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping(value = "/province/delete/{id}")
    public void deleteProvince(@PathVariable Integer id){
        provinceService.deleteProvince(id);
    }

    @PutMapping(value = "/province/update")
    public void updateProvince(@RequestBody Province province){
        provinceService.updateProvince(province);
    }

    @GetMapping("province/getIdAndNameById")
    public ResponseEntity<?> getProvinceIdAndNameById(@RequestParam("provinceId") Integer provinceId)
    {
        List<Map<String, Object>> result = provinceService.getProvinceIdAndNameById(provinceId);
        return ResponseEntity.ok().body(result);
    }
    @GetMapping("province/getTableData")
    public ResponseEntity<?> getTableData(
            @RequestParam("start") int start,
            @RequestParam("size") int size,
            @RequestParam("filters") String filters,
            @RequestParam("sorting") String sorting,
            @RequestParam("globalFilter") String globalFilter
    ) {
        PaginatedResponse<Province> result = provinceService.getTableData(start, size, filters, sorting,globalFilter);
        return ResponseEntity.ok().body(result);
    }

}
