package com.project.back_end.services;

import com.project.back_end.models.Prescription;
import com.project.back_end.repo.PrescriptionRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public ResponseEntity<Map<String, Object>> savePrescription(Prescription prescription) {
        try {
            List<Prescription> existing = prescriptionRepository.findByAppointmentId(prescription.getAppointmentId());

            if (!existing.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of(
                                "status", "error",
                                "message", "Prescription already exists for this appointment."
                        ));
            }

            Prescription savedPrescription = prescriptionRepository.save(prescription);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "status", "success",
                            "message", "Prescription saved successfully.",
                            "prescription", savedPrescription
                    ));
        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to save prescription."
                    ));
        }
    }

    public ResponseEntity<Map<String, Object>> getPrescription(Long appointmentId) {
        try {
            List<Prescription> prescriptions = prescriptionRepository.findByAppointmentId(appointmentId);

            if (prescriptions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "status", "error",
                                "message", "No prescription found for this appointment."
                        ));
            }

            Prescription prescription = prescriptions.get(0);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "prescription", prescription
            ));
        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Error retrieving prescription."
                    ));
        }
    }
}