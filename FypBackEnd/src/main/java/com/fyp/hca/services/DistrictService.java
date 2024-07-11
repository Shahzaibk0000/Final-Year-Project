package com.fyp.hca.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.hca.entity.District;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.repositories.DistrictRepository;
import com.fyp.hca.repositories.TehsilRepository;
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
public class DistrictService {
    private final DistrictRepository districtRepository;
    private final TehsilRepository tehsilRepository;
    private final UsersRepository userRepository;

    @Autowired
    public DistrictService(DistrictRepository districtRepository, TehsilRepository tehsilRepository, UsersRepository userRepository) {
        this.districtRepository = districtRepository;
        this.tehsilRepository = tehsilRepository;
        this.userRepository = userRepository;
    }

    public List<District> getDistrict() {
        return districtRepository.findAll();
    }

    public Optional<District> getDistrictById(Integer id) {
        return districtRepository.findById(id);
    }

    public List<Map<String, Object>> getDistrictIdAndName() {
        return districtRepository.findDistrictIdAndName();
    }

    public void addDistrict(District district) {
        districtRepository.save(district);
    }

    public void deleteDistrict(Integer id) {
        districtRepository.deleteById(id);
    }

    public void updateDistrict(District district) {
        districtRepository.save(district);
    }

    public boolean isDistrictAssociated(Integer districtId) {
        long tehsilCount = tehsilRepository.countByDistrictId(districtId);
        long userCount = userRepository.countByTehsilId(districtId);
        return tehsilCount > 0 || userCount > 0;
    }

    public List<Map<String, Object>> getDistrictIdAndNameByDivisionIds(List<Integer> divisionIds) {
        return districtRepository.findDistrictIdAndNameByDivisionIds(divisionIds);
    }

    public PaginatedResponse<District> getTableData(int start, int size, String filters, String sorting, String globalFilter) {
        Pageable pageable = PageRequest.of(start / size, size, parseSort(sorting));
        Specification<District> specification = parseFilters(filters, globalFilter);

        List<District> districts = districtRepository.findAll(specification, pageable).getContent();
        long totalCount = districtRepository.count();

        return new PaginatedResponse<>(districts, totalCount);
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

    private Specification<District> parseFilters(String filters, String globalFilter) {
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
                    if (isStringField("division.name")) {
                        globalPredicates.add(createStringPredicate("division.name", globalFilterUpper, root, criteriaBuilder));
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

    private Predicate createStringPredicate(String field, String value, Root<District> root, CriteriaBuilder criteriaBuilder) {
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
        return "name".equals(field) || "division.name".equals(field);
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
