package com.project.back_end.services;

import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
    }

    public int bookAppointment(Appointment appointment) {
        try {
            appointmentRepository.saveAndFlush(appointment);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Transactional
    public String updateAppointment(Long appointmentId, Appointment updatedAppointment, Long patientId) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointmentId);

        if (optionalAppointment.isEmpty()) {
            return "Appointment not found";
        }

        Appointment existing = optionalAppointment.get();

        if (!existing.getPatient().getId().equals(patientId)) {
            return "Unauthorized access";
        }

        if (updatedAppointment.getDoctor() == null || updatedAppointment.getDoctor().getId() == null) {
            return "Doctor is required";
        }

        if (updatedAppointment.getAppointmentTime() == null) {
            return "Appointment time is required";
        }

        Long doctorId = updatedAppointment.getDoctor().getId();
        Optional<Doctor> optionalDoctor = doctorRepository.findById(doctorId);

        if (optionalDoctor.isEmpty()) {
            return "Doctor not found";
        }

        LocalDateTime newTime = updatedAppointment.getAppointmentTime();

        List<Appointment> conflicts = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                doctorId,
                newTime.minusMinutes(59),
                newTime.plusMinutes(59)
        );

        boolean hasConflict = conflicts.stream()
                .anyMatch(appointment -> !appointment.getId().equals(appointmentId));

        if (hasConflict) {
            return "Doctor is not available at the selected time";
        }

        existing.setDoctor(optionalDoctor.get());
        existing.setAppointmentTime(newTime);
        existing.setStatus(updatedAppointment.getStatus());

        appointmentRepository.save(existing);
        return "Appointment updated successfully";
    }

    @Transactional
    public String cancelAppointment(Long appointmentId, Long patientId) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointmentId);

        if (optionalAppointment.isEmpty()) {
            return "Appointment not found";
        }

        Appointment appointment = optionalAppointment.get();

        if (!appointment.getPatient().getId().equals(patientId)) {
            return "Unauthorized cancellation";
        }

        appointmentRepository.delete(appointment);
        return "Appointment canceled successfully";
    }

    @Transactional
    public List<Appointment> getAppointmentsForDoctorOnDate(Long doctorId, LocalDate date, String patientName) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        if (patientName != null && !patientName.isBlank()) {
            return appointmentRepository.findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
                    doctorId, patientName, start, end);
        }

        return appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(doctorId, start, end);
    }

    @Transactional
    public void changeAppointmentStatus(Long appointmentId, int status) {
        appointmentRepository.updateStatus(status, appointmentId);
    }
}