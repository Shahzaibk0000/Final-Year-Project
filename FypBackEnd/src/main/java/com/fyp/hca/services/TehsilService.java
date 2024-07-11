package com.fyp.hca.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.hca.entity.Tehsil;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.repositories.HospitalRepository;
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
public class TehsilService {
    private final TehsilRepository tehsilRepository;
    private final HospitalRepository hospitalRepository;
    private final UsersRepository userRepository;

    @Autowired
    public TehsilService(TehsilRepository tehsilRepository, HospitalRepository hospitalRepository, UsersRepository userRepository) {
        this.tehsilRepository = tehsilRepository;
        this.hospitalRepository = hospitalRepository;
        this.userRepository = userRepository;
    }

    public void addTehsil(Tehsil tehsil) {
        tehsilRepository.save(tehsil);
    }

    public List<Tehsil> getTehsil() {
        return tehsilRepository.findAll();
    }

    public Optional<Tehsil> getTehsilById(Integer id) {
        return tehsilRepository.findById(id);
    }

    public List<Map<String, Object>> getTehsilIdAndName() {
        return tehsilRepository.findTehsilIdAndName();
    }

    public void deleteTehsil(Integer id) {
        tehsilRepository.deleteById(id);
    }

    public void updateTehsil(Tehsil tehsil) {
        tehsilRepository.save(tehsil);
    }

    public boolean isTehsilAssociated(Integer tehsilId) {
        long hospitalCount = hospitalRepository.countByTehsilId(tehsilId);
        long userCount = userRepository.countByTehsilId(tehsilId);
        return hospitalCount > 0 || userCount > 0;
    }

    public List<Map<String, Object>> getTehsilIdAndNameByDistrictIds(List<Integer> districtIds) {
        return tehsilRepository.findTehsilIdAndNameByDistrictIds(districtIds);
    }

    public PaginatedResponse<Tehsil> getTableData(int start, int size, String filters, String sorting, String globalFilter) {
        Pageable pageable = PageRequest.of(start / size, size, parseSort(sorting));
        Specification<Tehsil> specification = parseFilters(filters, globalFilter);

        List<Tehsil> tehsils = tehsilRepository.findAll(specification, pageable).getContent();
        long totalCount = tehsilRepository.count();

        return new PaginatedResponse<>(tehsils, totalCount);
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

    private Specification<Tehsil> parseFilters(String filters, String globalFilter) {
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
                    if (isStringField("district.name")) {
                        globalPredicates.add(createStringPredicate("district.name", globalFilterUpper, root, criteriaBuilder));
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

    private Predicate createStringPredicate(String field, String value, Root<Tehsil> root, CriteriaBuilder criteriaBuilder) {
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
        return "name".equals(field) || "district.name".equals(field);
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