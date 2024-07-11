package com.fyp.hca.services;

import com.fyp.hca.entity.*;
import com.fyp.hca.model.*;
import com.fyp.hca.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final PatientRepository patientRepository;
    private final UsersRepository usersRepository;
    private final DiseaseRepository diseaseRepository;
    private final HospitalRepository hospitalRepository;
    private final TehsilRepository tehsilRepository;
    private final DistrictRepository districtRepository;
    private final DivisionRepository divisionRepository;
    private final ProvinceRepository provinceRepository;

    @Autowired
    public DashboardService(PatientRepository patientRepository, UsersRepository usersRepository, DiseaseRepository diseaseRepository, HospitalRepository hospitalRepository, TehsilRepository tehsilRepository, DistrictRepository districtRepository, DivisionRepository divisionRepository, ProvinceRepository provinceRepository) {
        this.patientRepository = patientRepository;
        this.usersRepository = usersRepository;
        this.diseaseRepository = diseaseRepository;
        this.hospitalRepository = hospitalRepository;
        this.tehsilRepository = tehsilRepository;
        this.districtRepository = districtRepository;
        this.divisionRepository = divisionRepository;
        this.provinceRepository = provinceRepository;
    }

    public AnalyticResultModel getDashboardData(Integer userId, Integer diseaseId, FiltersRequestModel filters) {
        AnalyticResultModel result = new AnalyticResultModel();
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (patientRepository.CountbyDiseaseId(diseaseId)>0)
        {
        List<Patient> totalPatientsRecords = fetchPatientsByUserType(user, diseaseId);
        int totalPatients = totalPatientsRecords.size();
        List<Patient> filteredpatients;
        if (filters == null) {
            filteredpatients = totalPatientsRecords;
        } else {
            filteredpatients = applyFilters(totalPatientsRecords, filters, diseaseId);
        }
        Map<Date, Long> admissionDateCounts = filteredpatients.stream()
                .collect(Collectors.groupingBy(Patient::getAdmissionDate, Collectors.counting()));

        List<List<Object>> dataPoints = admissionDateCounts.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    List<Object> dataPoint = new ArrayList<>();
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
                    String formattedDate = dateFormat.format(entry.getKey());
                    dataPoint.add(formattedDate);
                    dataPoint.add(entry.getValue().intValue());
                    return dataPoint;
                })
                .collect(Collectors.toList());

        DynamicTimeChartData dynamicAreaTimeChart = new DynamicTimeChartData(dataPoints);
        result.setDynamicTimeChartData(dynamicAreaTimeChart);

        long CardiacCount = filteredpatients.stream().filter(Patient::getCardiac).count();
        long LargeIntestineCount = filteredpatients.stream().filter(Patient::getGastrointestinal).count();
        long SmallIntestineCount = filteredpatients.stream().filter(Patient::getGastrointestinal).count();
        long KidneyCount = filteredpatients.stream().filter(Patient::getKidney).count();
        long LungCount = filteredpatients.stream().filter(Patient::getRespiratory).count();
        result.setOrganChartData(new OrganChartData(CardiacCount, LargeIntestineCount, SmallIntestineCount, KidneyCount, LungCount));
        result.setStatisticResponse(calculateStatistics(filteredpatients, totalPatients));

        long feverCount = filteredpatients.stream().filter(Patient::getFever).count();
        long highFeverCount = filteredpatients.stream().filter(Patient::getHighFever).count();
        long hypertensionCount = filteredpatients.stream().filter(Patient::getHypertension).count();
        long cardiacCount = filteredpatients.stream().filter(Patient::getCardiac).count();
        long weaknessPainCount = filteredpatients.stream().filter(Patient::getWeaknessPain).count();
        long respiratoryCount = filteredpatients.stream().filter(Patient::getRespiratory).count();
        long cancerCount = filteredpatients.stream().filter(Patient::getCancer).count();
        long thyroidCount = filteredpatients.stream().filter(Patient::getThyroid).count();
        long prostateCount = filteredpatients.stream().filter(Patient::getProstate).count();
        long kidneyCount = filteredpatients.stream().filter(Patient::getKidney).count();
        long neuroCount = filteredpatients.stream().filter(Patient::getNeuro).count();
        long nauseaCount = filteredpatients.stream().filter(Patient::getNausea).count();
        long asymptomaticCount = filteredpatients.stream().filter(Patient::getAsymptomatic).count();
        long gastrointestinalCount = filteredpatients.stream().filter(Patient::getGastrointestinal).count();
        long orthoCount = filteredpatients.stream().filter(Patient::getOrtho).count();
        long respiratoryCDCount = filteredpatients.stream().filter(Patient::getRespiratoryCD).count();
        long cardiacsCDCount = filteredpatients.stream().filter(Patient::getCardiacsCD).count();
        long kidneyCDCount = filteredpatients.stream().filter(Patient::getKidneyCD).count();
        result.setBarRaceSymptoms(new BarRaceSymptoms(feverCount, highFeverCount, hypertensionCount, cardiacCount, weaknessPainCount, respiratoryCount, cancerCount, thyroidCount, prostateCount, kidneyCount, neuroCount, nauseaCount, asymptomaticCount, gastrointestinalCount, orthoCount, respiratoryCDCount, cardiacsCDCount, kidneyCDCount));

        List<int[]> femaleData = filteredpatients.stream()
                .filter(patient -> patient.getGender().toLowerCase().equals("0"))
                .map(patient -> new int[]{patient.getAge(), patient.getDeathBinary() ? 1 : 0})
                .collect(Collectors.toList());

        List<int[]> maleData = filteredpatients.stream()
                .filter(patient -> patient.getGender().toLowerCase().equals("1"))
                .map(patient -> new int[]{patient.getAge(), patient.getDeathBinary() ? 1 : 0})
                .collect(Collectors.toList());

        result.setScatterAggregateBar(new ScatterAggregateBar(femaleData, maleData));
            List<List<Object>> hospitalPatientCounts = filteredpatients.stream()
                    .collect(Collectors.groupingBy(patient -> Map.entry(patient.getHospitalName(), patient.getAdmissionYear()), Collectors.counting()))
                    .entrySet().stream()
                    .map(entry -> {
                        List<Object> hospitalCount = new ArrayList<>();
                        hospitalCount.add(entry.getValue().intValue());
                        hospitalCount.add(entry.getKey().getKey()); // Hospital name
                        hospitalCount.add(entry.getKey().getValue()); // Admission year
                        return hospitalCount;
                    })
                    .collect(Collectors.toList());
            result.setHospitalPatientCount(new HospitalPatientCount(hospitalPatientCounts));

            result.setDataPresent(true);
        }
        else
        {
            result.setStatisticResponse(new StatisticResponseModel());
            result.setDynamicTimeChartData(new DynamicTimeChartData(Collections.emptyList()));
            result.setOrganChartData(new OrganChartData(0, 0, 0, 0, 0)); // Initialize with appropriate default values
            result.setBarRaceSymptoms(new BarRaceSymptoms(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
            result.setScatterAggregateBar(new ScatterAggregateBar(Collections.emptyList(), Collections.emptyList()));
            result.setDataPresent(false);
        }
        return result;
    }

    private List<Patient> fetchPatientsByUserType(Users user, Integer diseaseId) {
        String userType = user.getUsertype();
        Optional<Disease> diseaseOpt = diseaseRepository.findById(diseaseId);
        if (diseaseOpt.isEmpty()) {
            return Collections.emptyList();
        }
        Disease disease = diseaseOpt.get();

        return switch (userType) {
            case "Super Administrator" -> patientRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                    .filter(patient -> patient.getDisease() != null && patient.getDisease().equals(disease))
                    .collect(Collectors.toList());
            case "Hospital Administrator" ->
                    patientRepository.findByHospitalId(user.getHospital().getId(), Sort.by(Sort.Direction.ASC, "id")).stream()
                            .filter(patient -> patient.getDisease() != null && patient.getDisease().equals(disease))
                            .collect(Collectors.toList());
            case "Tehsil Administrator" ->
                    patientRepository.findByTehsilId(user.getTehsil().getId(), Sort.by(Sort.Direction.ASC, "id")).stream()
                            .filter(patient -> patient.getDisease() != null && patient.getDisease().equals(disease))
                            .collect(Collectors.toList());
            case "District Administrator" ->
                    patientRepository.findByDistrictId(user.getDistrict().getId(), Sort.by(Sort.Direction.ASC, "id")).stream()
                            .filter(patient -> patient.getDisease() != null && patient.getDisease().equals(disease))
                            .collect(Collectors.toList());
            case "Division Administrator" ->
                    patientRepository.findByDivisionId(user.getDivision().getId(), Sort.by(Sort.Direction.ASC, "id")).stream()
                            .filter(patient -> patient.getDisease() != null && patient.getDisease().equals(disease))
                            .collect(Collectors.toList());
            case "Province Administrator" ->
                    patientRepository.findByProvinceId(user.getProvince().getId(), Sort.by(Sort.Direction.ASC, "id")).stream()
                            .filter(patient -> patient.getDisease() != null && patient.getDisease().equals(disease))
                            .collect(Collectors.toList());
            default -> throw new IllegalArgumentException("Unsupported user type: " + userType);
        };
    }

    private List<Patient> applyFilters(List<Patient> patients, FiltersRequestModel filters, Integer diseaseId) {
        if (filters == null) return patients;
        return patients.stream()
                .filter(patient -> filters.getProvinceIds() == null || filters.getProvinceIds().isEmpty() || filters.getProvinceIds().contains(patient.getHospital().getTehsil().getDistrict().getDivision().getProvince().getId()))
                .filter(patient -> filters.getDivisionIds() == null || filters.getDivisionIds().isEmpty() || filters.getDivisionIds().contains(patient.getHospital().getTehsil().getDistrict().getDivision().getId()))
                .filter(patient -> filters.getDistrictIds() == null || filters.getDistrictIds().isEmpty() || filters.getDistrictIds().contains(patient.getHospital().getTehsil().getDistrict().getId()))
                .filter(patient -> filters.getTehsilIds() == null || filters.getTehsilIds().isEmpty() || filters.getTehsilIds().contains(patient.getHospital().getTehsil().getId()))
                .filter(patient -> filters.getHospitalIds() == null || filters.getHospitalIds().isEmpty() || filters.getHospitalIds().contains(patient.getHospital().getId()))
                .filter(patient -> filters.getSymptoms() == null || filters.getSymptoms().isEmpty() || filters.getSymptoms().stream().allMatch(symptom -> hasSymptom(patient, symptom)))
                .filter(patient -> filters.getAdmissionStartDate() == null || !patient.getAdmissionDate().before(filters.getAdmissionStartDate()))
                .filter(patient -> filters.getAdmissionEndDate() == null || !patient.getAdmissionDate().after(filters.getAdmissionEndDate()))
                .filter(patient -> filters.getGender() == null || (filters.getGender() == 2) || filters.getGender().toString().equals(patient.getGender()))
                .filter(patient -> filters.getAgeStart() == null || patient.getAge() >= filters.getAgeStart())
                .filter(patient -> filters.getAgeEnd() == null || patient.getAge() <= filters.getAgeEnd())
                .filter(patient -> diseaseId == null || (patient.getDisease() != null && diseaseId.equals(patient.getDisease().getId())))
                .collect(Collectors.toList());
    }

    private boolean hasSymptom(Patient patient, String symptom) {
        return switch (symptom.toLowerCase()) {
            case "blood" -> patient.getBlood();
            case "chronicdisease" -> patient.getChronicdisease();
            case "diabetes" -> patient.getDiabetes();
            case "highfever" -> patient.getHighFever();
            case "fever" -> patient.getFever();
            case "hypertension" -> patient.getHypertension();
            case "cardiac" -> patient.getCardiac();
            case "weaknesspain" -> patient.getWeaknessPain();
            case "respiratory" -> patient.getRespiratory();
            case "cancer" -> patient.getCancer();
            case "thyroid" -> patient.getThyroid();
            case "prostate" -> patient.getProstate();
            case "kidney" -> patient.getKidney();
            case "neuro" -> patient.getNeuro();
            case "nausea" -> patient.getNausea();
            case "asymptomatic" -> patient.getAsymptomatic();
            case "gastrointestinal" -> patient.getGastrointestinal();
            case "ortho" -> patient.getOrtho();
            case "respiratorycd" -> patient.getRespiratoryCD();
            case "cardiacscd" -> patient.getCardiacsCD();
            default -> false;
        };
    }

    private StatisticResponseModel calculateStatistics(List<Patient> filteredPatients, int totalPatients) {
        StatisticResponseModel statistics = new StatisticResponseModel();
        statistics.setPatientsTotalCount(totalPatients);
        statistics.setPatientsCount(filteredPatients.size());

        long deathsCount = filteredPatients.stream().filter(Patient::getDeathBinary).count();
        statistics.setPatientsDeathsCount(deathsCount);

        long recoveredCount = filteredPatients.stream().filter(patient -> !patient.getDeathBinary()).count();
        statistics.setPatientsRecoveredCount(recoveredCount);

        long chronicCount = filteredPatients.stream().filter(Patient::getChronicdisease).count();
        statistics.setPatientsChronicCount(chronicCount);

        long malePatientCount= filteredPatients.stream().filter(patient -> "1".equals(patient.getGender())).count();
        statistics.setMalePatientCount(malePatientCount);

        long femalePatientCount= filteredPatients.stream().filter(patient -> "0".equals(patient.getGender())).count();
        statistics.setFemalePatientCount(femalePatientCount);

        Date admissionStartDate = filteredPatients.stream()
                .map(Patient::getAdmissionDate)
                .min(Comparator.naturalOrder())
                .orElse(null);

        Date admissionEndDate = filteredPatients.stream()
                .map(Patient::getAdmissionDate)
                .max(Comparator.naturalOrder())
                .orElse(null);

        statistics.setAdmissionStartDate(admissionStartDate);
        statistics.setAdmissionEndDate(admissionEndDate);

        return statistics;
    }
    public BarChartResponse getBarChartData(String areaType, Integer userId, Integer diseaseId, FiltersRequestModel filters) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<String> xAxis = new ArrayList<>();
        List<Integer> yAxis = new ArrayList<>();

        switch (user.getUsertype()) {
            case "Super Administrator":
                handleSuperAdministrator(areaType, diseaseId, xAxis, yAxis, filters);
                break;
            case "Province Administrator":
                handleProvinceAdministrator(user, areaType, diseaseId, xAxis, yAxis, filters);
                break;
            case "Division Administrator":
                handleDivisionAdministrator(user, areaType, diseaseId, xAxis, yAxis, filters);
                break;
            case "Tehsil Administrator":
                handleTehsilAdministrator(user, areaType, diseaseId, xAxis, yAxis, filters);
                break;
            case "Hospital Administrator":
                handleHospitalAdministrator(user, areaType, diseaseId, xAxis, yAxis, filters);
                break;
            default:
                throw new IllegalArgumentException("Unsupported user type: " + user.getUsertype());
        }

        return new BarChartResponse(xAxis, yAxis);
    }

    private void handleSuperAdministrator(String areaType, Integer diseaseId, List<String> xAxis, List<Integer> yAxis, FiltersRequestModel filters) {
        switch (areaType.toLowerCase()) {
            case "province":
                provinceRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).forEach(province -> {
                    List<Patient> patients = applyFilters(patientRepository.findByProvinceId(province.getId(),Sort.by(Sort.Direction.ASC, "id")), filters, diseaseId);
                    xAxis.add(province.getName());
                    yAxis.add(patients.size());
                });
                break;
            case "division":
                divisionRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).forEach(division -> {
                    List<Patient> patients = applyFilters(patientRepository.findByDivisionId(division.getId(),Sort.by(Sort.Direction.ASC, "id")), filters, diseaseId);
                    xAxis.add(division.getName());
                    yAxis.add(patients.size());
                });
                break;
            case "district":
                districtRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).forEach(district -> {
                    List<Patient> patients = applyFilters(patientRepository.findByDistrictId(district.getId(),Sort.by(Sort.Direction.ASC, "id")), filters, diseaseId);
                    xAxis.add(district.getName());
                    yAxis.add(patients.size());
                });
                break;
            case "tehsil":
                tehsilRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).forEach(tehsil -> {
                    List<Patient> patients = applyFilters(patientRepository.findByTehsilId(tehsil.getId(),Sort.by(Sort.Direction.ASC, "id")), filters, diseaseId);
                    xAxis.add(tehsil.getName());
                    yAxis.add(patients.size());
                });
                break;
            case "hospital":
                hospitalRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).forEach(hospital -> {
                    List<Patient> patients = applyFilters(patientRepository.findByHospitalId(hospital.getId(),Sort.by(Sort.Direction.ASC, "id")), filters, diseaseId);
                    xAxis.add(hospital.getName());
                    yAxis.add(patients.size());
                });
                break;
            default:
                throw new IllegalArgumentException("Unsupported area type: " + areaType);
        }
    }

    private void handleProvinceAdministrator(Users user, String areaType, Integer diseaseId, List<String> xAxis, List<Integer> yAxis, FiltersRequestModel filters) {
        Integer provinceId = user.getProvince().getId();
        switch (areaType.toLowerCase()) {
            case "division":
                divisionRepository.findAllByProvinceId(provinceId, Sort.by(Sort.Direction.ASC, "id")).forEach(division -> {
                    List<Patient> patients = applyFilters(patientRepository.findByDivisionId(division.getId(),Sort.by(Sort.Direction.ASC, "id")), filters, diseaseId);
                    xAxis.add(division.getName());
                    yAxis.add(patients.size());
                });
                break;
            case "district":
                districtRepository.findAllByProvinceId(provinceId, Sort.by(Sort.Direction.ASC, "id")).forEach(district -> {
                    List<Patient> patients = applyFilters(patientRepository.findByDistrictId(district.getId(),Sort.by(Sort.Direction.ASC, "id")), filters, diseaseId);
                    xAxis.add(district.getName());
                    yAxis.add(patients.size());
                });
                break;
            case "tehsil":
                tehsilRepository.findAllByProvinceId(provinceId, Sort.by(Sort.Direction.ASC, "id")).forEach(tehsil -> {
                    List<Patient> patients = applyFilters(patientRepository.findByTehsilId(tehsil.getId(),Sort.by(Sort.Direction.ASC, "id")), filters, diseaseId);
                    xAxis.add(tehsil.getName());
                    yAxis.add(patients.size());
                });
                break;
            case "hospital":
                hospitalRepository.findAllByProvinceId(provinceId, Sort.by(Sort.Direction.ASC, "id")).forEach(hospital -> {
                    List<Patient> patients = applyFilters(patientRepository.findByHospitalId(hospital.getId()), filters, diseaseId);
                    xAxis.add(hospital.getName());
                    yAxis.add(patients.size());
                });
                break;
            default:
                throw new IllegalArgumentException("Unsupported area type: " + areaType);
        }
    }

    private void handleDivisionAdministrator(Users user, String areaType, Integer diseaseId, List<String> xAxis, List<Integer> yAxis, FiltersRequestModel filters) {
        Integer divisionId = user.getDivision().getId();
        switch (areaType.toLowerCase()) {
            case "district":
                districtRepository.findAllByDivisionId(divisionId, Sort.by(Sort.Direction.ASC, "id")).forEach(district -> {
                    List<Patient> patients = applyFilters(patientRepository.findByDistrictId(district.getId(),Sort.by(Sort.Direction.ASC, "id")), filters, diseaseId);
                    xAxis.add(district.getName());
                    yAxis.add(patients.size());
                });
                break;
            case "tehsil":
                tehsilRepository.findAllByDivisionId(divisionId, Sort.by(Sort.Direction.ASC, "id")).forEach(tehsil -> {
                    List<Patient> patients = applyFilters(patientRepository.findByTehsilId(tehsil.getId(),Sort.by(Sort.Direction.ASC, "id")), filters, diseaseId);
                    xAxis.add(tehsil.getName());
                    yAxis.add(patients.size());
                });
                break;
            case "hospital":
                hospitalRepository.findAllByDivisionId(divisionId, Sort.by(Sort.Direction.ASC, "id")).forEach(hospital -> {
                    List<Patient> patients = applyFilters(patientRepository.findByHospitalId(hospital.getId()), filters, diseaseId);
                    xAxis.add(hospital.getName());
                    yAxis.add(patients.size());
                });
                break;
            default:
                throw new IllegalArgumentException("Unsupported area type: " + areaType);
        }
    }

    private void handleTehsilAdministrator(Users user, String areaType, Integer diseaseId, List<String> xAxis, List<Integer> yAxis, FiltersRequestModel filters) {
        Integer tehsilId = user.getTehsil().getId();
        if ("hospital".equalsIgnoreCase(areaType)) {
            hospitalRepository.findAllByTehsilId(tehsilId, Sort.by(Sort.Direction.ASC, "id")).forEach(hospital -> {
                List<Patient> patients = applyFilters(patientRepository.findByHospitalId(hospital.getId()), filters, diseaseId);
                xAxis.add(hospital.getName());
                yAxis.add(patients.size());
            });
        } else {
            throw new IllegalArgumentException("Unsupported area type: " + areaType);
        }
    }

    private void handleHospitalAdministrator(Users user, String areaType, Integer diseaseId, List<String> xAxis, List<Integer> yAxis, FiltersRequestModel filters) {
        Integer hospitalId = user.getHospital().getId();
        if ("hospital".equalsIgnoreCase(areaType)) {
            List<Patient> patients = applyFilters(patientRepository.findByHospitalId(hospitalId), filters, diseaseId);
            Map<Integer, Long> ageCounts = patients.stream()
                    .collect(Collectors.groupingBy(Patient::getAge, Collectors.counting()));
            ageCounts.forEach((age, count) -> {
                xAxis.add(age.toString());
                yAxis.add(count.intValue());
            });
        } else {
            throw new IllegalArgumentException("Unsupported area type: " + areaType);
        }
    }
}