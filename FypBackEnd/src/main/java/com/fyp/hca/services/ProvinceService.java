package com.fyp.hca.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.hca.entity.Province;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.repositories.ProvinceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProvinceService {

    @Autowired
    ProvinceRepository provinceRepository;

    public ProvinceService(ProvinceRepository provinceRepository) {
        this.provinceRepository = provinceRepository;
    }

    public void addProvince(Province province) {
        provinceRepository.save(province);
    }

    public List<Province> getProvince() {
        return provinceRepository.findAll();
    }

    public Optional<Province> getProvinceById(Integer id) {
        return provinceRepository.findById(id);
    }

    public void deleteProvince(Integer id) {
        provinceRepository.deleteById(id);
    }

    public void updateProvince(Province province) {
        provinceRepository.save(province);
    }

    public List<Map<String, Object>> getProvinceIdAndName() {
        return provinceRepository.findProvinceIdAndName();
    }

    public List<Map<String, Object>> getProvinceIdAndNameById(Integer provinceId) {
        return provinceRepository.findProvinceIdAndNameById(provinceId);
    }
    public PaginatedResponse<Province> getTableData(int start, int size, String filters, String sorting, String globalFilter) {
        Pageable pageable = PageRequest.of(start / size, size, parseSort(sorting));
        Specification<Province> specification = parseFilters(filters, globalFilter);

        List<Province> provinces = provinceRepository.findAll(specification, pageable).getContent();
        long totalCount = provinceRepository.count();

        return new PaginatedResponse<>(provinces, totalCount);
    }

    private Sort parseSort(String sorting) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            List<Map<String, Object>> sortingList = mapper.readValue(sorting, List.class);
            if (sortingList.isEmpty()) {
                return Sort.unsorted();
            }
            Map<String, Object> sortObj = sortingList.get(0);
            String property = (String) sortObj.get("id");
            boolean desc = (Boolean) sortObj.get("desc");
            return Sort.by(desc ? Sort.Direction.DESC : Sort.Direction.ASC, property);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return Sort.unsorted();
        }
    }

    private Specification<Province> parseFilters(String filters, String globalFilter) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            List<Map<String, Object>> filtersList = mapper.readValue(filters, List.class);
            return (root, query, criteriaBuilder) -> {
                List<Predicate> predicates = new ArrayList<>();

                for (Map<String, Object> filter : filtersList) {
                    String field = (String) filter.get("id");
                    String value = (String) filter.get("value");

                    if (isNumeric(value)) {
                        predicates.add(criteriaBuilder.equal(root.get(field), Integer.parseInt(value)));
                    } else if (isDate(value)) {
                        try {
                            LocalDate date = Instant.parse(value).atZone(ZoneId.systemDefault()).toLocalDate();
                            predicates.add(criteriaBuilder.equal(criteriaBuilder.function("DATE", LocalDate.class, root.get(field)), date));
                        } catch (DateTimeParseException e) {
                            e.printStackTrace();
                        }
                    } else {
                        String strValue = value.toUpperCase();
                        if (isStringField(field)) {
                            predicates.add(criteriaBuilder.like(criteriaBuilder.upper(root.get(field)), "%" + strValue + "%"));
                        } else {
                            predicates.add(criteriaBuilder.equal(root.get(field), value));
                        }
                    }
                }

                if (globalFilter != null && !globalFilter.isEmpty()) {
                    String globalFilterUpper = globalFilter.toUpperCase();
                    List<Predicate> globalPredicates = new ArrayList<>();
                    if (isStringField("name")) {
                        globalPredicates.add(criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%" + globalFilterUpper + "%"));
                    }
                    if (isNumeric(globalFilter)) {
                        globalPredicates.add(criteriaBuilder.equal(root.get("id"), Integer.parseInt(globalFilter)));
                    }
                    if (isDate(globalFilter)) {
                        try {
                            LocalDate date = Instant.parse(globalFilter).atZone(ZoneId.systemDefault()).toLocalDate();
                            globalPredicates.add(criteriaBuilder.equal(criteriaBuilder.function("DATE", LocalDate.class, root.get("createdOn")), date));
                            globalPredicates.add(criteriaBuilder.equal(criteriaBuilder.function("DATE", LocalDate.class, root.get("updatedOn")), date));
                        } catch (DateTimeParseException e) {
                            e.printStackTrace();
                        }
                    }

                    predicates.add(criteriaBuilder.or(globalPredicates.toArray(new Predicate[0])));
                }

                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            };
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    private boolean isStringField(String field) {
        return "name".equals(field);
    }

    private boolean isNumeric(String value) {
        try {
            Integer.parseInt(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean isDate(String value) {
        try {
            Instant.parse(value);
            return true;
        } catch (DateTimeParseException e) {
            return false;
        }
    }
}