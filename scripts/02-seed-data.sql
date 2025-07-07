-- Insert sample departments
INSERT INTO departments (name, description) VALUES
('Cardiology', 'Heart and cardiovascular system'),
('Neurology', 'Brain and nervous system'),
('Orthopedics', 'Bones, joints, and muscles'),
('Pediatrics', 'Medical care for children'),
('Emergency Medicine', 'Emergency and urgent care'),
('Internal Medicine', 'General internal medicine')
ON CONFLICT (name) DO NOTHING;

-- Insert sample doctors
INSERT INTO doctors (first_name, last_name, email, phone, specialization, license_number, department_id) VALUES
('John', 'Smith', 'john.smith@hospital.com', '555-0101', 'Cardiologist', 'MD001', 1),
('Sarah', 'Johnson', 'sarah.johnson@hospital.com', '555-0102', 'Neurologist', 'MD002', 2),
('Michael', 'Brown', 'michael.brown@hospital.com', '555-0103', 'Orthopedic Surgeon', 'MD003', 3),
('Emily', 'Davis', 'emily.davis@hospital.com', '555-0104', 'Pediatrician', 'MD004', 4),
('Robert', 'Wilson', 'robert.wilson@hospital.com', '555-0105', 'Emergency Physician', 'MD005', 5)
ON CONFLICT (email) DO NOTHING;

-- Insert sample patients
INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address, emergency_contact_name, emergency_contact_phone, blood_type, allergies) VALUES
('Alice', 'Anderson', '1985-03-15', 'Female', '555-1001', 'alice.anderson@email.com', '123 Main St, City, State', 'Bob Anderson', '555-1002', 'A+', 'Penicillin'),
('David', 'Miller', '1978-07-22', 'Male', '555-1003', 'david.miller@email.com', '456 Oak Ave, City, State', 'Lisa Miller', '555-1004', 'O-', 'None'),
('Emma', 'Taylor', '1992-11-08', 'Female', '555-1005', 'emma.taylor@email.com', '789 Pine Rd, City, State', 'James Taylor', '555-1006', 'B+', 'Shellfish'),
('William', 'Garcia', '1965-01-30', 'Male', '555-1007', 'william.garcia@email.com', '321 Elm St, City, State', 'Maria Garcia', '555-1008', 'AB+', 'Latex')
ON CONFLICT DO NOTHING;
