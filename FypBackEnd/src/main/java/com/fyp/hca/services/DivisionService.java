package com.fyp.hca.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.hca.entity.Division;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.repositories.DistrictRepository;
import com.fyp.hca.repositories.DivisionRepository;
import com.fyp.hca.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DivisionService {
    private final DivisionRepository divisionRepository;
    private final DistrictRepository districtRepository;
    private final UsersRepository userRepository;

    @Autowired
    public DivisionService(DivisionRepository divisionRepository, DistrictRepository districtRepository, UsersRepository userRepository) {
        this.divisionRepository = divisionRepository;
        this.districtRepository = districtRepository;
        this.userRepository = userRepository;
    }

    public void addDivision(Division division) {
        divisionRepository.save(division);
    }

    public List<Division> getDivision() {
        return divisionRepository.findAll();
    }

    public Optional<Division> getDivisionById(Integer id) {
        return divisionRepository.findById(id);
    }

    public List<Map<String, Object>> getDivisionIdAndName() {
        return divisionRepository.findDivisionIdAndName();
    }

    public void deleteDivision(Integer id) {
        divisionRepository.deleteById(id);
    }

    public void updateDivision(Division division) {
        divisionRepository.save(division);
    }

    public boolean isDivisionAssociated(Integer divisionId) {
        long districtCount = districtRepository.countByDivisionId(divisionId);
        long userCount = userRepository.countByTehsilId(divisionId);
        return districtCount > 0 || userCount > 0;
    }

    public List<Map<String, Object>> getDivisionByProvinceIds(List<Integer> provinceIds) {
        return divisionRepository.findDivisionIdAndNameByProvinceIds(provinceIds);
    }

    public PaginatedResponse<Division> getTableData(int start, int size, String filters, String sorting, String globalFilter) {
        Pageable pageable = PageRequest.of(start / size, size, parseSort(sorting));
        Specification<Division> specification = parseFilters(filters, globalFilter);

        List<Division> divisions = divisionRepository.findAll(specification, pageable).getContent();
        long totalCount = divisionRepository.count();

        return new PaginatedResponse<>(divisions, totalCount);
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

    private Specification<Division> parseFilters(String filters, String globalFilter) {
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
                            predicates.add(createStringPredicate(field, strValue, root, criteriaBuilder));
                        } else {
                            predicates.add(criteriaBuilder.equal(root.get(field), value));
                        }
                    }
                }

                if (globalFilter != null && !globalFilter.isEmpty()) {
                    String globalFilterUpper = globalFilter.toUpperCase();
                    List<Predicate> globalPredicates = new ArrayList<>();

                    if (isStringField("name")) {
                        globalPredicates.add(createStringPredicate("name", globalFilterUpper, root, criteriaBuilder));
                    }
                    if (isStringField("province.name")) {
                        globalPredicates.add(createStringPredicate("province.name", globalFilterUpper, root, criteriaBuilder));
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

    private Predicate createStringPredicate(String field, String value, Root<Division> root, CriteriaBuilder criteriaBuilder) {
        String[] fieldParts = field.split("\\.");
        if (fieldParts.length > 1) {
            Join<Object, Object> join = null;
            for (int i = 0; i < fieldParts.length - 1; i++) {
                if (join == null) {
                    join = root.join(fieldParts[i]);
                } else {
                    join = join.join(fieldParts[i]);
                }
            }
            return criteriaBuilder.like(criteriaBuilder.upper(join.get(fieldParts[fieldParts.length - 1])), "%" + value + "%");
        } else {
            return criteriaBuilder.like(criteriaBuilder.upper(root.get(field)), "%" + value + "%");
        }
    }

    private boolean isStringField(String field) {
        return "name".equals(field) || "province.name".equals(field);
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
