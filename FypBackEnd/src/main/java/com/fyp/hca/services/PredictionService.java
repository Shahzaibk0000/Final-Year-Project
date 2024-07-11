package com.fyp.hca.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Service
public class PredictionService {

    private final RestTemplate restTemplate;
    private final String pythonApiUrl;

    public PredictionService(RestTemplate restTemplate, @Value("${python.api.url}") String pythonApiUrl) {
        this.restTemplate = restTemplate;
        this.pythonApiUrl = pythonApiUrl;
    }

    public List<Prediction> fetchPredictions() {
        String apiUrl = pythonApiUrl + "/update_predictions";
        // Adjust this as per your requirement, whether it's fetching from a GET request or performing a POST request
        List<Prediction> predictions = restTemplate.getForObject(apiUrl, List.class);
        return predictions;
    }

    public static class Prediction {
        private String date;
        private double predictedPatients;
        private double ventilatorsRequired;
        private double oxygenCylindersRequired;

        // Constructors, getters, and setters
        // (typically generated automatically by IDE or explicitly defined)

        public Prediction(String date, double predictedPatients, double ventilatorsRequired, double oxygenCylindersRequired) {
            this.date = date;
            this.predictedPatients = predictedPatients;
            this.ventilatorsRequired = ventilatorsRequired;
            this.oxygenCylindersRequired = oxygenCylindersRequired;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public double getPredictedPatients() {
            return predictedPatients;
        }

        public void setPredictedPatients(double predictedPatients) {
            this.predictedPatients = predictedPatients;
        }

        public double getVentilatorsRequired() {
            return ventilatorsRequired;
        }

        public void setVentilatorsRequired(double ventilatorsRequired) {
            this.ventilatorsRequired = ventilatorsRequired;
        }

        public double getOxygenCylindersRequired() {
            return oxygenCylindersRequired;
        }

        public void setOxygenCylindersRequired(double oxygenCylindersRequired) {
            this.oxygenCylindersRequired = oxygenCylindersRequired;
        }
    }

}
