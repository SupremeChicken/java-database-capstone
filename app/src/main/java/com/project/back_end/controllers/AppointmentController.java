package com.project.back_end.controllers;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.Service;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final Service service;

    public AppointmentController(AppointmentService appointmentService, Service service) {
        this.appointmentService = appointmentService;
        this.service = service;
    }

    @GetMapping("/{token}/{date}")
    public ResponseEntity<Map<String, Object>> getAppointments(
            @PathVariable String token,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String patientName) {

        if (!service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token."));
        }

        Long doctorId = service.tokenService.extractDoctorIdFromToken(token);

        if (doctorId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Doctor ID missing or invalid."));
        }

        List<Appointment> appointments = appointmentService.getAppointmentsForDoctorOnDate(doctorId, date, patientName);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "appointments", appointments
        ));
    }

    @PostMapping("/book/{token}")
    public ResponseEntity<Map<String, Object>> bookAppointment(@PathVariable String token, @RequestBody Appointment appointment) {
        if (!service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token."));
        }

        if (appointment.getDoctor() == null || appointment.getDoctor().getId() == null || appointment.getAppointmentTime() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Invalid appointment information."));
        }

        int validationCode = service.validateAppointment(
                appointment.getDoctor().getId(),
                appointment.getAppointmentTime().toLocalDate(),
                appointment.getAppointmentTime().toLocalTime()
        );

        if (validationCode == -1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Doctor not found."));
        }

        if (validationCode == 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("status", "error", "message", "Appointment slot is not available."));
        }

        int result = appointmentService.bookAppointment(appointment);

        if (result == 1) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("status", "success", "message", "Appointment booked successfully."));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("status", "error", "message", "Failed to book appointment."));
    }

    @PutMapping("/update/{token}/{appointmentId}/{patientId}")
    public ResponseEntity<Map<String, Object>> updateAppointment(
            @PathVariable String token,
            @PathVariable Long appointmentId,
            @PathVariable Long patientId,
            @RequestBody Appointment updatedAppointment) {

        if (!service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token."));
        }

        Long tokenPatientId = service.tokenService.extractPatientIdFromToken(token);

        if (tokenPatientId == null || !tokenPatientId.equals(patientId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("status", "error", "message", "You cannot update another patient's appointment."));
        }

        String result = appointmentService.updateAppointment(appointmentId, updatedAppointment, patientId);

        if ("Appointment updated successfully".equals(result)) {
            return ResponseEntity.ok(Map.of("status", "success", "message", result));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("status", "error", "message", result));
    }

    @DeleteMapping("/cancel/{token}/{appointmentId}/{patientId}")
    public ResponseEntity<Map<String, Object>> cancelAppointment(
            @PathVariable String token,
            @PathVariable Long appointmentId,
            @PathVariable Long patientId) {

        if (!service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token."));
        }

        Long tokenPatientId = service.tokenService.extractPatientIdFromToken(token);

        if (tokenPatientId == null || !tokenPatientId.equals(patientId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("status", "error", "message", "You cannot cancel another patient's appointment."));
        }

        String result = appointmentService.cancelAppointment(appointmentId, patientId);

        if ("Appointment canceled successfully".equals(result)) {
            return ResponseEntity.ok(Map.of("status", "success", "message", result));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("status", "error", "message", result));
    }
}