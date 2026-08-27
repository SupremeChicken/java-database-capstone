package com.project.back_end.services;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class TokenService {

    @Value("${jwt.secret}")
    private String secret;

    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public TokenService(AdminRepository adminRepository, DoctorRepository doctorRepository, PatientRepository patientRepository) {
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String generateToken(String email) {
        return generateToken(null, null, email);
    }

    public String generateToken(Object user, String role, String username) {
        var builder = Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7));

        if (role != null) {
            builder.claim("role", role);
        }

        if (user instanceof Doctor doctor) {
            builder.claim("doctorId", doctor.getId());
        } else if (user instanceof Patient patient) {
            builder.claim("patientId", patient.getId());
        }

        return builder.signWith(getSigningKey()).compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractEmailFromToken(String token) {
        return extractEmail(token);
    }

    public String extractRoleFromToken(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public Long extractDoctorIdFromToken(String token) {
        Number doctorId = extractClaims(token).get("doctorId", Number.class);
        return doctorId != null ? doctorId.longValue() : null;
    }

    public Long extractPatientIdFromToken(String token) {
        Number patientId = extractClaims(token).get("patientId", Number.class);
        return patientId != null ? patientId.longValue() : null;
    }

    public boolean validateToken(String token, String role) {
        try {
            Claims claims = extractClaims(token);
            String username = claims.getSubject();
            String tokenRole = claims.get("role", String.class);

            if (username == null || role == null || !role.equalsIgnoreCase(tokenRole)) {
                return false;
            }

            return switch (role.toLowerCase()) {
                case "admin" -> adminRepository.findByUsername(username) != null;
                case "doctor" -> doctorRepository.findByEmail(username) != null;
                case "patient" -> patientRepository.findByEmail(username) != null;
                default -> false;
            };
        } catch (Exception e) {
            return false;
        }
    }
}