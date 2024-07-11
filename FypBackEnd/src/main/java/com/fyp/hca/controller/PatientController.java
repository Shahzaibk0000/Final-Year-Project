package com.fyp.hca.controller;

import com.fyp.hca.entity.Patient;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/patient")
public class PatientController {
    private final PatientService patientService;

    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }


    @PostMapping("/add")
    public ResponseEntity<String> addPatient(@RequestBody Patient patient) {
        try {
            patientService.addPatient(patient);
            return ResponseEntity.status(HttpStatus.CREATED).body("Patient added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while adding patient");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<Patient>> getPatients() {
        List<Patient> patients = patientService.getPatients();
        return ResponseEntity.ok().body(patients);
    }

    @GetMapping("/getPatientsByHospitalId/{hospitalId}")
    public ResponseEntity<List<Patient>> getPatientsByHospitalId(@PathVariable Integer hospitalId) {
        List<Patient> patients = patientService.getPatientsByHospitalId(hospitalId);
        return ResponseEntity.ok().body(patients);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable Integer id) {
        Optional<Patient> patient = patientService.getPatientById(id);
        if (patient.isPresent()) {
            return ResponseEntity.ok().body(patient.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Patient not found");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Integer id) {
        try {
            patientService.deletePatient(id);
            return ResponseEntity.status(HttpStatus.OK).body("Patient deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while deleting patient");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updatePatient(@RequestBody Patient patient) {
        try {
            patientService.updatePatient(patient);
            return ResponseEntity.status(HttpStatus.OK).body("Patient updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while updating patient");
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadCSVFile(@RequestParam("file") MultipartFile file,@RequestParam("hospitalId") Integer hospitalId, @RequestParam("diseaseId") Integer diseaseId ) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("File is empty", HttpStatus.BAD_REQUEST);
        }
        try {
            patientService.savePatientsFromCSV(file,hospitalId,diseaseId);

            String uploadDir = "D:\\latest\\Kafka_Running_service_for_files_processing\\processing";
            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            return new ResponseEntity<>("File uploaded successfully", HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to upload file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTableData")
    public ResponseEntity<?> getTableData(
            @RequestParam("start") int start,
            @RequestParam("size") int size,
            @RequestParam("filters") String filters,
            @RequestParam("sorting") String sorting,
            @RequestParam("globalFilter") String globalFilter,
            @RequestParam(value = "hospitalId" ,required = false) Integer hospitalId
    ) {
        PaginatedResponse<Patient> result = patientService.getTableData(start, size, filters, sorting,globalFilter,hospitalId);
        return ResponseEntity.ok().body(result);
    }
}
