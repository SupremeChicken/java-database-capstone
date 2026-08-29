package com.project.back_end.controllers;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.Service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "prescription")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final AppointmentService appointmentService;
    private final Service service;

    public PrescriptionController(PrescriptionService prescriptionService, AppointmentService appointmentService, Service service) {
        this.prescriptionService = prescriptionService;
        this.appointmentService = appointmentService;
        this.service = service;
    }

    @PostMapping("/save/{token}")
    public ResponseEntity<?> savePrescription(@RequestBody Prescription prescription, @PathVariable String token) {
        if (!service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token."));
        }

        if (prescription.getAppointmentId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Appointment ID is required."));
        }

        ResponseEntity<?> response = prescriptionService.savePrescription(prescription);

        if (response.getStatusCode().is2xxSuccessful()) {
            appointmentService.changeAppointmentStatus(prescription.getAppointmentId(), 1);
        }

        return response;
    }

    @GetMapping("/{appointmentId}/{token}")
    public ResponseEntity<?> getPrescription(@PathVariable Long appointmentId, @PathVariable String token) {
        if (!service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token."));
        }

        return prescriptionService.getPrescription(appointmentId);
    }
}