package com.fyp.hca.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.hca.entity.Disease;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.repositories.DiseaseRepository;
import com.fyp.hca.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DiseaseService {

    private final DiseaseRepository diseaseRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public DiseaseService(DiseaseRepository diseaseRepository, PatientRepository patientRepository) {
        this.diseaseRepository = diseaseRepository;
        this.patientRepository = patientRepository;
    }

    public void addDisease(Disease disease) {
        diseaseRepository.save(disease);
    }

    public List<Disease> getDiseases() {
        return new ArrayList<>(diseaseRepository.findAll());
    }

    public Optional<Disease> getDiseaseById(Integer id) {
        return diseaseRepository.findById(id);
    }

    public void deleteDisease(Integer id) {
        diseaseRepository.deleteById(id);
    }

    public void updateDisease(Disease disease) {
        diseaseRepository.save(disease);
    }

    public List<Map<String, Object>> getDiseaseIdAndName() {
        return diseaseRepository.findDiseaseIdAndName();
    }

    public boolean isDiseaseAssociated(Integer diseaseId) {
        long patientCount = patientRepository.countByDiseaseId(diseaseId);
        return patientCount > 0;
    }

    public PaginatedResponse<Disease> getTableData(int start, int size, String filters, String sorting, String globalFilter) {
        Pageable pageable = PageRequest.of(start / size, size, parseSort(sorting));
        Specification<Disease> specification = parseFilters(filters, globalFilter);

        List<Disease> diseases = diseaseRepository.findAll(specification, pageable).getContent();
        long totalCount = diseaseRepository.count();

        return new PaginatedResponse<>(diseases, totalCount);
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

    private Specification<Disease> parseFilters(String filters, String globalFilter) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            List<Map<String, Object>> filtersList = mapper.readValue(filters, List.class);
            return (root, query, criteriaBuilder) -> {
                List<Predicate> predicates = new ArrayList<>();

                for (Map<String, Object> filter : filtersList) {
                    String field = (String) filter.get("id");
                    String value = (String) filter.get("value");

                    if ("id".equals(field) && isNumeric(value)) {
                        predicates.add(criteriaBuilder.equal(root.get(field), Integer.parseInt(value)));
                    } else {
                        String strValue = value.toUpperCase();
                        predicates.add(criteriaBuilder.like(criteriaBuilder.upper(root.get(field)), "%" + strValue + "%"));
                    }
                }

                if (globalFilter != null && !globalFilter.isEmpty()) {
                    String globalFilterUpper = globalFilter.toUpperCase();
                    List<Predicate> globalPredicates = new ArrayList<>();

                    if (isStringField("name")) {
                        globalPredicates.add(criteriaBuilder.like(criteriaBuilder.upper(root.get("name")), "%" + globalFilterUpper + "%"));
                    }
                    if (isStringField("description")) {
                        globalPredicates.add(criteriaBuilder.like(criteriaBuilder.upper(root.get("description")), "%" + globalFilterUpper + "%"));
                    }
                    if (isStringField("symptoms")) {
                        globalPredicates.add(criteriaBuilder.like(criteriaBuilder.upper(root.get("symptoms")), "%" + globalFilterUpper + "%"));
                    }
                    if (isStringField("causes")) {
                        globalPredicates.add(criteriaBuilder.like(criteriaBuilder.upper(root.get("causes")), "%" + globalFilterUpper + "%"));
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
        return "name".equals(field) || "description".equals(field) || "symptoms".equals(field) || "causes".equals(field);
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
