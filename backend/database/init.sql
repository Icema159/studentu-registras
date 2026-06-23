DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS student_infos;
DROP TABLE IF EXISTS students;

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  course VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_infos (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  email VARCHAR(255),
  phone VARCHAR(50),
  address VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  credits INTEGER NOT NULL CHECK (credits > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (first_name, last_name, course)
VALUES
('Jonas', 'Jonaitis', 'JavaScript'),
('Aistė', 'Petrauskaitė', 'React'),
('Mantas', 'Kazlauskas', 'Node.js');
('Petras', 'Jonaitis', 'JavaScript'),

INSERT INTO student_infos (student_id, email, phone, address, notes)
VALUES
(1, 'jonas@example.com', '+37060000001', 'Vilnius', 'Aktyvus studentas'),
(2, 'aiste@example.com', '+37060000002', 'Kaunas', 'Domisi frontend'),
(3, 'mantas@example.com', '+37060000003', 'Klaipėda', 'Domisi backend');

INSERT INTO subjects (student_id, title, credits)
VALUES
(1, 'JavaScript', 6),
(1, 'HTML/CSS', 4),
(2, 'React', 6),
(3, 'Node.js', 6);
.