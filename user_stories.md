# User Story Template

**Title:**
_As a [user role], I want [feature/goal], so that [reason]._

**Acceptance Criteria:**
1. [Criteria 1]
2. [Criteria 2]
3. [Criteria 3]

**Priority:** [High/Medium/Low]

**Story Points:** [Estimated Effort in Points]

**Notes:**
- [Additional information or edge cases]

## Patient User Stories

**Title:**
As a Patient User, I want to view my upcoming appointments, so that I can prepare accordingly.

**Acceptance Criteria:**
1. Logged-in patients can access a list or dashboard showing their scheduled future appointments.
2. Appointment list shows relevant information: date, time, doctor, location/format (in-person/virtual), and appointment status.
3. Users can filter, sort, or search upcoming appointments for ease of access.
4. There is a clear indication for any changes (reschedules/cancellations) or special instructions for each appointment.
5. The view is optimized for web and mobile devices.

**Priority:** High

**Story Points:**

**Notes:**
- Ensure data privacy—only logged-in users can view their own appointments.
- Consider options for exporting or adding to digital calendars.
- Audit UX for clarity and accessibility.

---

**Title:**
As a Patient User, I want to log in and book an hour-long appointment with a doctor, so that I can consult for medical advice or treatment.

**Acceptance Criteria:**
1. Logged-in Patient Users can select a doctor and view their available time slots.
2. Patient can book an hour-long appointment by choosing a suitable available slot from the doctor's schedule.
3. After booking, confirmation is displayed and optionally emailed.
4. System prevents double-booking or overlapping appointments.
5. Patient can view, modify, or cancel upcoming bookings.

**Priority:** High

**Story Points:**

**Notes:**
- Patient must be logged in before booking.
- Time slot selection interface should support both web and mobile use.
- Track appointment status for both patient and doctor dashboards.

---

**Title:**
As a Patient User, I want to log out of the portal, so that I can secure my account.

**Acceptance Criteria:**
1. Users have access to a visible and accessible "Log Out" option from main navigation.
2. Logging out immediately terminates the user's session and access to private data.
3. After logging out, the user is redirected to the public landing or login page.
4. Attempts to access protected resources post-logout prompt for re-authentication.

**Priority:** High

**Story Points:**

**Notes:**
- Ensure session/token is invalidated securely upon logout.
- Design should prevent accidental logouts while still enabling quick sign-out when needed.
- Test for usability and security across browsers and devices.

---

**Title:**
As a Patient User, I want to log into the portal, so that I can manage my bookings.

**Acceptance Criteria:**
1. Login page for Patient Users accepting email and password.
2. Login authenticates credentials and establishes a secure session.
3. Upon successful login, user gains access to manage, create, or cancel bookings.
4. Invalid credentials return clear user-friendly error messages.
5. Secure session management ensures logout and protection of user data.

**Priority:** High

**Story Points:**

**Notes:**
- Must ensure login follows security best practices (hashing/password transport).
- Consider feedback for unsuccessful login attempts and account recovery processes.
- Support for future multi-factor authentication is a plus.

---

**Title:**
As a Patient User, I want to sign up using my email and password, so that I can book appointments.

**Acceptance Criteria:**
1. Sign up page allows Patient Users to register using email address and secure password.
2. Registration requires confirmation (e.g., email verification or confirmation message).
3. Upon successful sign up, user is able to log in and book appointments with doctors.
4. Registration form validates required fields and enforces password complexity rules.
5. Feedback and error messages are user-friendly (e.g., duplicate email handling, weak password, etc.).

**Priority:** High

**Story Points:**

**Notes:**
- Consider supporting additional user roles in the future.
- Ensure proper hashing and secure handling of user credentials.
- Provide options to reset password if user forgets credentials.

---

**Title:**
As a Patient User, I want to view a list of doctors without logging in, so that I can explore options before registering.

**Acceptance Criteria:**
1. Unauthenticated users can access a public-facing page or feature showing approved doctors' basic profiles.
2. Information displayed must not include sensitive data; only safe-to-share details (name, specialty, credentials, etc.).
3. Doctors' availability/status is visible where appropriate.
4. There is a clear call to action to register or book once a user finds a suitable doctor.
5. Security and privacy are maintained (no doctor contact info, etc. unless appropriate for public display).

**Priority:** High

**Story Points:**

**Notes:**
- Ensure page loads efficiently for both web and mobile.
- Consider search/sort/filter options to improve user experience.
- Audit for compliance with privacy rules and use only public data.

---



## Doctor User Stories

**Title:**
As a Doctor User, I want to view the patient details for my upcoming appointments, so that I can be prepared.

**Acceptance Criteria:**
1. Doctors can see a list of upcoming appointments, each displaying relevant patient information (name, age, contact as appropriate, reason for visit).
2. Sensitive data is shown only if necessary for the appointment—compliant with privacy rules and organization policy.
3. Access to past visit notes, medication history, or important alerts is provided for each appointment where relevant.
4. Doctor has clear navigation to move from calendar view or dashboard to detailed patient info page per appointment.

**Priority:** High

**Story Points:**

**Notes:**
- Patient consent and organization rules determine what info is visible.
- Audit to ensure HIPAA/compliance where applicable.
- Doctors can note for themselves any pre-visit preparation that is needed.

---

**Title:**
As a Doctor User, I want to update my profile with specialization and contact information, so that patients have up-to-date information.

**Acceptance Criteria:**
1. Doctors can edit and update their profile, including specialization (e.g., cardiology, dermatology), credentials, and professional summary.
2. Doctors can add or edit contact information that is appropriate for patient access (e.g., email, phone, office location).
3. All profile changes require verification before being published to patients (if organization policy applies).
4. Patients can view doctor specialization and contact information directly on the public or authenticated doctor profile page.
5. Profile editing is easy to use and available on both desktop and mobile interfaces.

**Priority:** High

**Story Points:**

**Notes:**
- Data privacy: Only approved contact information should be shown to patients.
- Consider workflow for admin review or approval if necessary.
- Track and allow doctor to see last updated timestamp for profile.

---

**Title:**
As a Doctor User, I want to view my appointment calendar, so that I can stay organized.

**Acceptance Criteria:**
1. Logged-in doctors can access a calendar view displaying all scheduled appointments.
2. Appointments are shown with relevant details: patient name, date, time, and type (virtual/in-person).
3. Calendar supports month, week, and day views for easy scheduling.
4. Clear indicators for canceled, rescheduled, or special-status appointments.
5. Calendar can be filtered for past, current, and upcoming appointments.

**Priority:** High

**Story Points:**

**Notes:**
- Ensure the calendar is responsive for use on both desktop and mobile.
- Consider integration/export to external calendar apps (Google, Outlook etc).
- Confirm patient data privacy is respected in all calendar displays.

---

**Title:**
As a Doctor User, I want to log out of the portal, so that I can protect my data.

**Acceptance Criteria:**
1. Doctors can access a clearly labeled "Log Out" button from any page within the portal.
2. Logout immediately ends the user's session and any access to protected information.
3. The user is redirected to a login or landing page after logging out.
4. Any attempts to access doctor data after logout prompt re-authentication.

**Priority:** High

**Story Points:**

**Notes:**
- Logout should securely invalidate active tokens/sessions.
- Prevent accidental logout, but allow quick signout as needed.
- Confirm compatibility across desktop and mobile interfaces.

---

**Title:**
As a Doctor User, I want to log into the portal, so that I can manage my appointments.

**Acceptance Criteria:**
1. Login page for Doctor Users accepting email and password.
2. Login authenticates credentials and establishes a secure session for doctor accounts.
3. Upon successful login, the doctor can view, manage, and update their appointments.
4. Invalid login attempts return clear error messages.
5. Secure session management, supporting logout and security best practices.

**Priority:** High

**Story Points:**

**Notes:**
- Doctor account login should be distinct and prepared for future multi-role support.
- Support for account recovery and multi-factor authentication in future.
- Consider feedback for unsuccessful login attempts and ensure security against brute-force attacks.

---



## Admin User Stories

**Title:**
As an Admin, I want to run a stored procedure in MySQL CLI to get the number of appointments per month and track usage statistics.

**Acceptance Criteria:**
1. Stored procedure exists in the MySQL database to calculate the total number of appointments for each month.
2. Admin can execute the stored procedure via MySQL CLI and retrieve results clearly grouped by month.
3. Usage statistics (e.g., monthly appointment counts) are exportable or viewable for further analysis.
4. Documentation is provided for running the stored procedure and interpreting results.
5. Robust error handling for running and retrieving data from the stored procedure.

**Priority:** High

**Story Points:**

**Notes:**
- Consider example output such as (Month, Appointment Count).
- Stored procedure name and parameters should be documented.
- Ensure only authorized users/Admins can execute the procedure.
- Optionally add logging of usage statistics queries for audit.

---

**Title:**
As an Admin, I want to delete a doctor's profile from the portal, so that I can remove healthcare providers who should no longer have access or association.

**Acceptance Criteria:**
1. Admin is able to search for and select a doctor's profile on the portal.
2. Admin can initiate and confirm deletion of a doctor's profile.
3. The system requests confirmation before deletion and warns of data loss or dependency issues.
4. Deleted doctors are immediately removed from active listings and can no longer access the portal.
5. All deletions are logged for audit purposes.

**Priority:** High

**Story Points:**

**Notes:**
- Confirm that deleted profiles do not remain in associated schedules or active lists.
- Ensure proper authentication and authorization before allowing deletion.
- If there are dependencies (appointments, records), provide appropriate warnings or handling.
- Consider GDPR/data privacy compliance for personal data removal.

---

**Title:**
As an Admin, I want to add doctors to the portal, so that I can manage healthcare providers within the system.

**Acceptance Criteria:**
1. Admins can access a form or interface to add new doctors to the portal.
2. Required information (e.g., name, specialty, contact details, credential verification) must be collected for each doctor.
3. The system should validate doctor information before saving.
4. Added doctors are immediately available for management and scheduling.

**Priority:** High

**Story Points:**

**Notes:**
- Consider edge cases such as duplicate doctor entries or missing required fields.
- Ensure only Admin users have access to this feature.
- Audit actions for accountability and traceability.

---

**Title:**
As an Admin, I want to log out of the portal, so that I can protect system access.

**Acceptance Criteria:**
1. A visible and accessible "Log Out" option is available from key navigation points (e.g., dashboard, header).
2. Logging out ends the Admin session securely, preventing unauthorized access.
3. After logging out, the Admin is redirected to the login page or public landing page.
4. Attempts to use restricted features after logging out will require re-authentication.

**Priority:** High

**Story Points:**

**Notes:**
- Ensure that logout invalidates the current session/token immediately.
- Consider any special cases for Admin users.
- Thoroughly test session timeouts and forced logouts.

---

**Title:**
As an Admin, I want to log into the portal with my username and password, so that I can manage the platform securely.

**Acceptance Criteria:**
1. Admins can access a dedicated login page.
2. Login requires a valid username and password combo.
3. Unsuccessful login attempts display meaningful error messages and do not disclose sensitive information.
4. Successful authentication reroutes admin users to the admin dashboard.
5. Session management ensures secure access and logout capability.
6. All authentication flows are logged for security audits.

**Priority:** High

**Story Points:**

**Notes:**
- Ensure password security (e.g., hashing, secure transport).
- Consider account lockout or rate limiting after repeated failed attempts.
- Follow best practices for secure authentication.
