# Architecture Summary:
This Spring Boot application follows a three-tier architecture pattern:

- **Presentation Tier**:  
  - Thymeleaf templates render dynamic HTML for Admin and Doctor dashboards.  
  - REST APIs serve data to frontend or mobile clients for modules like Appointments and Patient Records.

- **Application Tier**:  
  - Controllers (both MVC and REST) route requests to a centralized **Service Layer**.  
  - The Service Layer enforces business rules and communicates with data repositories.

- **Data Tier**:  
  - **MySQL** handles structured data (Patients, Doctors, Appointments, Admins).  
  - **MongoDB** stores flexible, document-based prescription data.

Spring Boot allows modular development and integrates well with CI/CD tools. The dual-database setup allows optimal storage for both structured and semi-structured data.

---

## **Flow of Data and Control**:

```gherkin
1. User initiates a request  
   - Through Thymeleaf (AdminDashboard/DoctorDashboard) or  
   - Via RESTful clients (Appointment or Patient APIs)

2. The request is routed by Spring Boot  
   - MVC Controllers handle server-rendered views (.html via Thymeleaf)  
   - REST Controllers handle HTTP API requests and respond in JSON

3. The controller invokes the appropriate Service Layer method  
   - Business rules are applied (e.g., check availability, validate form input)

4. The Service Layer calls the Repository Layer  
   - Spring Data JPA Repositories (for MySQL)  
   - Spring Data MongoDB Repositories (for Prescriptions)

5. Repositories query or persist data  
   - MySQL stores relational data (patients, appointments)  
   - MongoDB handles flexible schema documents (prescriptions)

6. Data is bound to Java models  
   - JPA Entities for SQL data (`@Entity`)  
   - MongoDB Documents (`@Document`) for NoSQL collections

7. Response is generated  
   - Thymeleaf templates receive models and render HTML  
   - REST endpoints return serialized JSON data to clients
````

---
