package com.project.back_end.services;

import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;

    public DoctorService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository, TokenService tokenService) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
    }

    @Transactional
    public List<String> getDoctorAvailability(Long doctorId, Date date) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(doctorId);

        if (optionalDoctor.isEmpty()) {
            return Collections.emptyList();
        }

        Doctor doctor = optionalDoctor.get();
        List<String> allSlots = doctor.getAvailableTimes();

        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                doctorId,
                new java.sql.Timestamp(date.getTime()).toLocalDateTime().withHour(0).withMinute(0),
                new java.sql.Timestamp(date.getTime()).toLocalDateTime().withHour(23).withMinute(59)
        );

        Set<String> bookedSlots = bookedAppointments.stream()
                .map(appointment -> appointment.getAppointmentTime().toLocalTime().toString())
                .collect(Collectors.toSet());

        return allSlots.stream()
                .filter(slot -> {
                    String startTime = slot.split("-")[0];
                    return !bookedSlots.contains(startTime);
                })
                .sorted()
                .collect(Collectors.toList());
    }

    public int saveDoctor(Doctor doctor) {
        if (doctorRepository.findByEmail(doctor.getEmail()) != null) {
            return -1;
        }

        try {
            doctorRepository.saveAndFlush(doctor);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Transactional
    public int updateDoctor(Long id, Doctor updated) {
        Optional<Doctor> optional = doctorRepository.findById(id);

        if (optional.isEmpty()) {
            return -1;
        }

        try {
            Doctor doctor = optional.get();
            doctor.setName(updated.getName());
            doctor.setEmail(updated.getEmail());
            doctor.setPhone(updated.getPhone());
            doctor.setSpecialty(updated.getSpecialty());
            doctor.setAvailableTimes(updated.getAvailableTimes());

            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public List<Doctor> getDoctors() {
        return doctorRepository.findAll();
    }

    @Transactional
    public int deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            return -1;
        }

        try {
            appointmentRepository.deleteAllByDoctorId(id);
            doctorRepository.deleteById(id);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public ResponseEntity<Map<String, String>> validateDoctor(String email, String password) {
        try {
            Doctor doctor = doctorRepository.findByEmail(email);

            if (doctor == null || !doctor.getPassword().equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", "error", "message", "Invalid email or password."));
            }

            String token = tokenService.generateToken(doctor, "doctor", email);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Doctor login successful.",
                    "token", token,
                    "role", "doctor",
                    "email", email
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Login failed due to an internal error."));
        }
    }

    @Transactional
    public List<Doctor> findDoctorByName(String name) {
        return doctorRepository.findByNameLike("%" + name + "%");
    }

    @Transactional
    public List<Doctor> filterDoctorsByNameSpecialtyAndTime(String name, String specialty, String timePeriod) {
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        return filterDoctorsByTime(doctors, timePeriod);
    }

    public List<Doctor> filterDoctorsByTime(List<Doctor> doctors, String timePeriod) {
        return doctors.stream()
                .filter(doctor -> doctor.getAvailableTimes().stream().anyMatch(timeStr -> {
                    LocalTime time = LocalTime.parse(timeStr.split("-")[0]);
                    return timePeriod.equalsIgnoreCase("AM") ? time.isBefore(LocalTime.NOON) : !time.isBefore(LocalTime.NOON);
                }))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<Doctor> filterDoctorByNameAndTime(String name, String timePeriod) {
        List<Doctor> doctors = doctorRepository.findByNameLike("%" + name + "%");
        return filterDoctorsByTime(doctors, timePeriod);
    }

    @Transactional
    public List<Doctor> filterDoctorByNameAndSpecialty(String name, String specialty) {
        return doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
    }

    @Transactional
    public List<Doctor> filterDoctorByTimeAndSpecialty(String specialty, String timePeriod) {
        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        return filterDoctorsByTime(doctors, timePeriod);
    }

    @Transactional
    public List<Doctor> filterDoctorBySpecialty(String specialty) {
        return doctorRepository.findBySpecialtyIgnoreCase(specialty);
    }

    @Transactional
    public List<Doctor> filterDoctorsByTime(String timePeriod) {
        return filterDoctorsByTime(doctorRepository.findAll(), timePeriod);
    }
}