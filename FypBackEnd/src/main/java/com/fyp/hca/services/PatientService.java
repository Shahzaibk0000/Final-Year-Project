package com.fyp.hca.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.hca.entity.Disease;
import com.fyp.hca.entity.Hospital;
import com.fyp.hca.entity.Patient;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.repositories.HospitalRepository;
import com.fyp.hca.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;
    @Autowired
    public PatientService(PatientRepository patientRepository,HospitalRepository hospitalRepository) {
        this.patientRepository = patientRepository;
        this.hospitalRepository = hospitalRepository;
    }

    public void addPatient(Patient patient) {
        patientRepository.save(patient);
    }

    public List<Patient> getPatients() {
        return new ArrayList<>(patientRepository.findAll());
    }

    public List<Patient> getPatientsByHospitalId(Integer hospitalId) {
        return new ArrayList<>(patientRepository.findByHospitalId(hospitalId));
    }

    public void deletePatient(Integer id) {
        patientRepository.deleteById(id);
    }

    public void updatePatient(Patient patient) {
        patientRepository.save(patient);
    }

    public Optional<Patient> getPatientById(Integer id) {
        return patientRepository.findById(id);
    }

    @Transactional
    public void savePatientsFromCSV(MultipartFile file,Integer hospitalId,Integer diseaseId) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }
                String[] data = line.split(",");
                Patient patient = new Patient();

                patient.setFirstName(data[0]);
                patient.setLastName(data[1]);
                patient.setCnic(data[2]);
                patient.setAge(Integer.parseInt(data[3]));
                try {
                    patient.setAdmissionDate(new Date(new SimpleDateFormat("MM/dd/yyyy").parse(data[4]).getTime()));
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }

                patient.setChronicdisease(verify(data[5]));
                patient.setGender(data[6]);
                patient.setDeathBinary(verify(data[7]));
                patient.setRespiratory(verify(data[8]));
                patient.setWeaknessPain(verify(data[9]));
                Boolean bool = verify(data[10]);
                patient.setFever(bool);
                patient.setGastrointestinal(verify(data[11]));
                patient.setNausea(verify(data[12]));
                patient.setCardiac(Boolean.parseBoolean(data[13]));
                patient.setHighFever(Boolean.parseBoolean(data[14]));
                patient.setKidney(Boolean.parseBoolean(data[15]));
                patient.setAsymptomatic(Boolean.parseBoolean(data[16]));
                patient.setDiabetes(Boolean.parseBoolean(data[17]));
                patient.setNeuro(Boolean.parseBoolean(data[18]));
                patient.setHypertension(Boolean.parseBoolean(data[19]));
                patient.setCancer(Boolean.parseBoolean(data[20]));
                patient.setOrtho(Boolean.parseBoolean(data[21]));
                patient.setRespiratoryCD(Boolean.parseBoolean(data[22]));
                patient.setCardiacsCD(Boolean.parseBoolean(data[23]));
                patient.setKidneyCD(Boolean.parseBoolean(data[24]));
                patient.setBlood(Boolean.parseBoolean(data[25]));
                patient.setProstate(Boolean.parseBoolean(data[26]));
                patient.setThyroid(Boolean.parseBoolean(data[27]));

                Hospital hospital = new Hospital();
                hospital.setId(hospitalId);
                patient.setHospital(hospital);

                Disease disease = new Disease();
                disease.setId(diseaseId);
                patient.setDisease(disease);

                patientRepository.save(patient);
            }
        }
    }
    public PaginatedResponse<Patient> getTableData(int start, int size, String filters, String sorting, String globalFilter, Integer hospitalId) {
        Pageable pageable = PageRequest.of(start / size, size, parseSort(sorting));
        Specification<Patient> specification = parseFilters(filters, globalFilter);

        List<Patient> patients;
        long totalCount;

        if (hospitalId != null) {
            Optional<Hospital> hospital = hospitalRepository.findById(hospitalId);
            if (hospital.isPresent()) {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("hospital"), hospital.get()));

                Page<Patient> patientPage = patientRepository.findAll(specification, pageable);
                patients = patientPage.getContent();
                totalCount = patientPage.getTotalElements();
            } else {
                patients = Collections.emptyList();
                totalCount = 0;
            }
        } else {
            Page<Patient> patientPage = patientRepository.findAll(specification, pageable);
            patients = patientPage.getContent();
            totalCount = patientPage.getTotalElements();
        }

        return new PaginatedResponse<>(patients, totalCount);
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

    private Specification<Patient> parseFilters(String filters, String globalFilter) {
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
                        if (isBooleanField(field)) {
                            predicates.add(criteriaBuilder.equal(root.get(field), parseBoolean(value)));
                        } else if ("gender".equals(field)) {
                            predicates.add(criteriaBuilder.equal(root.get(field), parseGender(value)));
                        } else if ("deathBinary".equals(field)) {
                            Boolean deathBinaryValue = parseDeathBinary(value);
                            if (deathBinaryValue != null) {
                                predicates.add(criteriaBuilder.equal(root.get(field), deathBinaryValue));
                            }
                        } else if (isStringField(field)) {
                            predicates.add(createStringPredicate(field, strValue, root, criteriaBuilder));
                        } else {
                            predicates.add(criteriaBuilder.equal(root.get(field), value));
                        }
                    }
                }

                if (globalFilter != null && !globalFilter.isEmpty()) {
                    String globalFilterUpper = globalFilter.toUpperCase();
                    List<Predicate> globalPredicates = new ArrayList<>();

                    if (isStringField("firstName")) {
                        globalPredicates.add(createStringPredicate("firstName", globalFilterUpper, root, criteriaBuilder));
                    }
                    if (isStringField("lastName")) {
                        globalPredicates.add(createStringPredicate("lastName", globalFilterUpper, root, criteriaBuilder));
                    }
                    if (isStringField("cnic")) {
                        globalPredicates.add(createStringPredicate("cnic", globalFilterUpper, root, criteriaBuilder));
                    }
                    if (isNumeric(globalFilter)) {
                        globalPredicates.add(criteriaBuilder.equal(root.get("id"), Integer.parseInt(globalFilter)));
                    }
                    if (isDate(globalFilter)) {
                        try {
                            LocalDate date = Instant.parse(globalFilter).atZone(ZoneId.systemDefault()).toLocalDate();
                            globalPredicates.add(criteriaBuilder.equal(criteriaBuilder.function("DATE", LocalDate.class, root.get("admissionDate")), date));
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

    private Boolean verify(String s){
        if(s.equals("1")){
            return true;
        }else{
            return false;
        }
    }

    private Predicate createStringPredicate(String field, String value, Root<Patient> root, CriteriaBuilder criteriaBuilder) {
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
        return "firstName".equals(field) || "lastName".equals(field) || "cnic".equals(field);
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

    private boolean isBooleanField(String field) {
        return "blood".equals(field) || "chronicdisease".equals(field) || "diabetes".equals(field) || "highFever".equals(field) ||
                "fever".equals(field) || "hypertension".equals(field) || "cardiac".equals(field) || "weaknessPain".equals(field) ||
                "respiratory".equals(field) || "cancer".equals(field) || "thyroid".equals(field) || "prostate".equals(field) ||
                "kidney".equals(field) || "neuro".equals(field) || "nausea".equals(field) || "asymptomatic".equals(field) ||
                "gastrointestinal".equals(field) || "ortho".equals(field) || "respiratoryCD".equals(field) || "cardiacsCD".equals(field) ||
                "kidneyCD".equals(field);
    }

    private boolean parseBoolean(String value) {
        value = value.trim().toLowerCase();
        if( value.equals("yes") || value.equals("ye") || value.equals("y"))
            return true;
        else if(value.equals("no") || value.equals("n")) {
            return false;
        }
        else {
            return true;
        }
    }

    private String parseGender(String value) {
        value = value.trim().toLowerCase();
        if (value.contains("ma") || value.contains("mal") || value.contains("male")) {
            return "male";
        } else if (value.contains("f") || value.contains("fe") || value.contains("fem") || value.contains("fema") || value.contains("femal") || value.contains("female")) {
            return "female";
        } else {
            return null;
        }
    }


    private Boolean parseDeathBinary(String value) {
        value = value.trim().toLowerCase();
        if (value.contains("deceased") || value.contains("d") || value.contains("de") || value.contains("dec") ||
                value.contains("dece") || value.contains("decea") || value.contains("deceas") || value.contains("decease")
                ) {
            return true;
        } else if (value.contains("alive") || value.contains("a") || value.contains("al") || value.contains("ali") ||
                value.contains("aliv") || value.contains("living") || value.contains("livi") ||
                value.contains("livin") ) {
            return false;
        }
        return null;
    }
}