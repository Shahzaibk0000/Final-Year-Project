package com.fyp.hca.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class UploadDataService {
    /*private final KafkaProducerService kafkaProducerService;

    @Value("${kafka.upload.topic}")
    private String uploadTopic;

    @Autowired
    public UploadDataService(KafkaProducerService kafkaProducerService) {
        this.kafkaProducerService = kafkaProducerService;
    }

    public String uploadFile(MultipartFile file, int hospitalId, int diseaseId) throws IOException {
        if (Objects.isNull(file) || file.isEmpty()) {
            throw new IOException("Please select a file to upload");
        }

        String fileExtension = Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf(".") + 1);
        if (!"csv".equalsIgnoreCase(fileExtension)) {
            throw new IOException("Only CSV files are allowed. The provided file has the extension: " + fileExtension);
        }
        String fileName = "Hospital-" + hospitalId + "-" + new SimpleDateFormat("dd/MM/yyyy").format(new Date()) + "-patientData.csv";
        Path uploadDirectory = Paths.get("src/main/java/com/fyp/hca/uploaddata/");
        file.transferTo(uploadDirectory.toFile());
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> allRows = reader.readAll();
            processData(allRows, hospitalId, diseaseId);
            Files.deleteIfExists(uploadDirectory.resolve(fileName));

        }
        catch (Exception e) {
            throw new IOException("Failed to process data: " + e.getMessage(), e);
        }
        return "File uploaded successfully";
    }

    public void processData(List<String[]> allRows, Integer hospitalId, Integer diseaseId) {
        for (int i = 1; i < allRows.size(); i++) {
            String[] parts = allRows.get(i);
            if (parts.length == 28) {
                String message = String.join(",", parts) + "," + hospitalId + "," + diseaseId;
                kafkaProducerService.sendMessage(uploadTopic,message);
            } else
                System.out.println("Csv data does not contain 28 columns");
        }
    }*/
}