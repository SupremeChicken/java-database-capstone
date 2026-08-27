package com.project.back_end.controllers;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Doctor;
import com.project.back_end.services.DoctorService;
import com.project.back_end.services.Service;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final Service service;

    public DoctorController(DoctorService doctorService, Service service) {
        this.doctorService = doctorService;
        this.service = service;
    }

    @GetMapping("/availability/{user}/{doctorId}/{date}/{token}")
    public ResponseEntity<Map<String, Object>> getDoctorAvailability(
            @PathVariable String user,
            @PathVariable Long doctorId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable String token) {

        if (!service.validateToken(token, user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token."));
        }

        List<?> availableSlots = doctorService.getDoctorAvailability(doctorId, Date.valueOf(date));
        return ResponseEntity.ok(Map.of("status", "success", "availableSlots", availableSlots));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDoctors() {
        List<Doctor> doctors = doctorService.getDoctors();
        return ResponseEntity.ok(Map.of("status", "success", "doctors", doctors));
    }

    @PostMapping("/register/{token}")
    public ResponseEntity<Map<String, Object>> saveDoctor(@RequestBody Doctor doctor, @PathVariable String token) {
        if (!service.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized access."));
        }

        int result = doctorService.saveDoctor(doctor);

        return switch (result) {
            case -1 -> ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("status", "error", "message", "Doctor with email already exists."));
            case 1 -> ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("status", "success", "message", "Doctor registered successfully."));
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error while registering doctor."));
        };
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> doctorLogin(@RequestBody Login login) {
        return doctorService.validateDoctor(login.getEmail(), login.getPassword());
    }

    @PutMapping("/update/{token}/{doctorId}")
    public ResponseEntity<Map<String, Object>> updateDoctor(
            @RequestBody Doctor updatedDoctor,
            @PathVariable String token,
            @PathVariable Long doctorId) {

        if (!service.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized access."));
        }

        int result = doctorService.updateDoctor(doctorId, updatedDoctor);

        return switch (result) {
            case -1 -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Doctor not found."));
            case 1 -> ResponseEntity.ok(Map.of("status", "success", "message", "Doctor updated successfully."));
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error while updating doctor."));
        };
    }

    @DeleteMapping("/delete/{token}/{doctorId}")
    public ResponseEntity<Map<String, Object>> deleteDoctor(@PathVariable String token, @PathVariable Long doctorId) {
        if (!service.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Unauthorized access."));
        }

        int result = doctorService.deleteDoctor(doctorId);

        return switch (result) {
            case -1 -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Doctor not found."));
            case 1 -> ResponseEntity.ok(Map.of("status", "success", "message", "Doctor and associated appointments deleted successfully."));
            default -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error while deleting doctor."));
        };
    }

    @GetMapping("/filter")
    public ResponseEntity<Map<String, Object>> filterDoctor(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String time,
            @RequestParam(required = false) String speciality) {

        List<Doctor> doctors = service.filterDoctor(name, speciality, time);
        return ResponseEntity.ok(Map.of("status", "success", "doctors", doctors));
    }
}