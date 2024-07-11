package com.fyp.hca.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.hca.entity.Hospital;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.repositories.HospitalRepository;
import com.fyp.hca.repositories.PatientRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class HospitalService {
    @Autowired
    private final HospitalRepository hospitalRepository;
    private final PatientRepository patientRepository;
    private final UsersRepository userRepository;

    @Autowired
    public HospitalService(HospitalRepository hospitalRepository, PatientRepository patientRepository, UsersRepository userRepository) {
        this.hospitalRepository = hospitalRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public void addHospital(Hospital hospital) {
        hospitalRepository.save(hospital);
    }

    public List<Hospital> getHospitals() {
        return new ArrayList<>(hospitalRepository.findAll());
    }

    public Optional<Hospital> getHospitalById(Integer id) {
        return hospitalRepository.findById(id);
    }

    public void deleteHospital(Integer id) {
        hospitalRepository.deleteById(id);
    }

    public void updateHospital(Hospital hospital) {
        hospitalRepository.save(hospital);
    }

    public List<Map<String, Object>> getHospitalIdAndName() {
        return hospitalRepository.findHospitalIdAndName();
    }

    public boolean isHospitalAssociated(Integer hospitalId) {
        long patientCount = patientRepository.countByHospitalId(hospitalId);
        long userCount = userRepository.countByHospitalId(hospitalId);
        return patientCount > 0 || userCount > 0;
    }

    public List<Map<String, Object>> getHospitalIdAndNameByTehsilIds(List<Integer> tehsilIds) {
        return hospitalRepository.findHospitalIdAndNameByTehsilIds(tehsilIds);
    }

    public PaginatedResponse<Hospital> getTableData(int start, int size, String filters, String sorting, String globalFilter) {
        Pageable pageable = PageRequest.of(start / size, size, parseSort(sorting));
        Specification<Hospital> specification = parseFilters(filters, globalFilter);

        List<Hospital> hospitals = hospitalRepository.findAll(specification, pageable).getContent();
        long totalCount = hospitalRepository.count();

        return new PaginatedResponse<>(hospitals, totalCount);
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

    private Specification<Hospital> parseFilters(String filters, String globalFilter) {
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
                    } else if (isStringField(field)) {
                        String strValue = value.toUpperCase();
                        predicates.add(createStringPredicate(field, strValue, root, criteriaBuilder));
                    } else {
                        predicates.add(criteriaBuilder.equal(root.get(field), value));
                    }
                }

                if (globalFilter != null && !globalFilter.isEmpty()) {
                    String globalFilterUpper = globalFilter.toUpperCase();
                    List<Predicate> globalPredicates = new ArrayList<>();

                    if (isStringField("name")) {
                        globalPredicates.add(createStringPredicate("name", globalFilterUpper, root, criteriaBuilder));
                    }
                    if (isStringField("code")) {
                        globalPredicates.add(createStringPredicate("code", globalFilterUpper, root, criteriaBuilder));
                    }
                    if (isStringField("address")) {
                        globalPredicates.add(createStringPredicate("address", globalFilterUpper, root, criteriaBuilder));
                    }
                    if (isStringField("hospitalType")) {
                        globalPredicates.add(createStringPredicate("hospitalType", globalFilterUpper, root, criteriaBuilder));
                    }
                    if (isStringField("tehsil.name")) {
                        globalPredicates.add(createStringPredicate("tehsil.name", globalFilterUpper, root, criteriaBuilder));
                    }
                    if (isNumeric(globalFilter)) {
                        globalPredicates.add(criteriaBuilder.equal(root.get("id"), Integer.parseInt(globalFilter)));
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

    private Predicate createStringPredicate(String field, String value, Root<Hospital> root, CriteriaBuilder criteriaBuilder) {
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
        return "name".equals(field) || "code".equals(field) || "address".equals(field) || "hospitalType".equals(field) || "tehsil.name".equals(field);
    }

    private boolean isNumeric(String value) {
        try {
            Integer.parseInt(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
