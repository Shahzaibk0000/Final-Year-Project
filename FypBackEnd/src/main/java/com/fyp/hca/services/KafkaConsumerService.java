package com.fyp.hca.services;

import com.fyp.hca.entity.Patient;
import com.fyp.hca.repositories.DiseaseRepository;
import com.fyp.hca.repositories.HospitalRepository;
import com.fyp.hca.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

@Service
public class KafkaConsumerService {


    /*private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;
    private final DiseaseRepository diseaseRepository;

    @Autowired
    public KafkaConsumerService(PatientRepository patientRepository, HospitalRepository hospitalRepository, DiseaseRepository diseaseRepository) {
        this.patientRepository = patientRepository;
        this.hospitalRepository = hospitalRepository;
        this.diseaseRepository = diseaseRepository;
    }

    @KafkaListener(topics = "${kafka.upload.topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void listen(String message) {
        String[] parts = message.split(",");
        if (parts.length == 30) {
            try {
                Patient patient = createPatient(parts);
                patientRepository.save(patient);
            } catch (ParseException e) {
                throw new RuntimeException("Failed to parse admission date: " + e.getMessage());
            } catch (RuntimeException e) {
                throw new RuntimeException("Failed to save patient data: " + e.getMessage());
            }
        }
    }

    private Patient createPatient(String[] parts) throws ParseException {
        try {
            //convert string to int
            int hospitalId = Integer.parseInt(parts[28].trim());
            int diseaseId = Integer.parseInt(parts[29].trim());

            Patient patient = new Patient();
            patient.setFirstName(parts[0].trim());
            patient.setLastName(parts[1].trim());
            patient.setCnic(parts[2].trim());
            patient.setAdmissionDate(new Date(new SimpleDateFormat("MM/dd/yyyy").parse(parts[4].trim()).getTime()));
            String ageString = parts[3].trim();
            if (ageString.contains("-")) {
                String[] ageRange = ageString.split("-");
                int ageStart = Integer.parseInt(ageRange[0].trim());
                int ageEnd = Integer.parseInt(ageRange[1].trim());
                int averageAge = (ageStart + ageEnd) / 2;
                patient.setAge(averageAge);
            } else {
                patient.setAge(Integer.parseInt(ageString));
            }
            patient.setChronicdisease(Boolean.parseBoolean(parts[5].trim()));
            boolean generbinary = Boolean.parseBoolean(parts[6].trim());
            if (generbinary) {
                patient.setGender("Male");
            } else {
                patient.setGender("Female");
            }
            patient.setDeathBinary(Boolean.parseBoolean(parts[7].trim()));
            patient.setRespiratory(Boolean.parseBoolean(parts[8].trim()));
            patient.setWeaknessPain(Boolean.parseBoolean(parts[9].trim()));
            patient.setFever(Boolean.parseBoolean(parts[10].trim()));
            patient.setGastrointestinal(Boolean.parseBoolean(parts[11].trim()));
            patient.setNausea(Boolean.parseBoolean(parts[12].trim()));
            patient.setCardiac(Boolean.parseBoolean(parts[13].trim()));
            patient.setHighFever(Boolean.parseBoolean(parts[14].trim()));
            patient.setKidney(Boolean.parseBoolean(parts[15].trim()));
            patient.setAsymptomatic(Boolean.parseBoolean(parts[16].trim()));
            patient.setDiabetes(Boolean.parseBoolean(parts[17].trim()));
            patient.setNeuro(Boolean.parseBoolean(parts[18].trim()));
            patient.setHypertension(Boolean.parseBoolean(parts[19].trim()));
            patient.setCancer(Boolean.parseBoolean(parts[20].trim()));
            patient.setOrtho(Boolean.parseBoolean(parts[21].trim()));
            patient.setRespiratoryCD(Boolean.parseBoolean(parts[22].trim()));
            patient.setCardiacsCD(Boolean.parseBoolean(parts[23].trim()));
            patient.setKidneyCD(Boolean.parseBoolean(parts[24].trim()));
            patient.setBlood(Boolean.parseBoolean(parts[25].trim()));
            patient.setProstate(Boolean.parseBoolean(parts[26].trim()));
            patient.setThyroid(Boolean.parseBoolean(parts[27].trim()));
            patient.setHospital(hospitalRepository.findById(hospitalId)
                    .orElseThrow(() -> new RuntimeException("Hospital not found")));
            patient.setDisease(diseaseRepository.findById(diseaseId)
                    .orElseThrow(() -> new RuntimeException("Disease not found")));
            return patient;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create patient: " + e.getMessage());
        }
    }*/
}