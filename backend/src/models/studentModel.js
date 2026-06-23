const { pool } = require("../config/db");

const getAllStudents = async (filters = {}) => {
  const conditions = [];
  const values = [];

  if (filters.id) {
    values.push(filters.id);
    conditions.push(`id = $${values.length}`);
  }

  if (filters.course) {
    values.push(`%${filters.course}%`);
    conditions.push(`course ILIKE $${values.length}`);
  }

  const firstName = filters.first_name || filters.firstName;
  if (firstName) {
    values.push(`%${firstName}%`);
    conditions.push(`first_name ILIKE $${values.length}`);
  }

  const lastName = filters.last_name || filters.lastName;
  if (lastName) {
    values.push(`%${lastName}%`);
    conditions.push(`last_name ILIKE $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `
    SELECT id, first_name, last_name, course, created_at, updated_at
    FROM students
    ${whereClause}
    ORDER BY id ASC
    `,
    values
  );

  return result.rows;
};

const getStudentById = async (id) => {
  const studentResult = await pool.query(
    `
    SELECT id, first_name, last_name, course, created_at, updated_at
    FROM students
    WHERE id = $1
    `,
    [id]
  );

  if (studentResult.rows.length === 0) {
    return null;
  }

  const infoResult = await pool.query(
    `
    SELECT id, email, phone, address, notes
    FROM student_infos
    WHERE student_id = $1
    `,
    [id]
  );

  const subjectsResult = await pool.query(
    `
    SELECT id, title, credits
    FROM subjects
    WHERE student_id = $1
    ORDER BY id ASC
    `,
    [id]
  );

  return {
    ...studentResult.rows[0],
    info: infoResult.rows[0] || null,
    subjects: subjectsResult.rows,
  };
};

const createStudent = async ({ first_name, last_name, course }) => {
  const result = await pool.query(
    `
    INSERT INTO students (first_name, last_name, course)
    VALUES ($1, $2, $3)
    RETURNING id, first_name, last_name, course, created_at, updated_at
    `,
    [first_name, last_name, course]
  );

  return result.rows[0];
};

const updateStudent = async (id, { first_name, last_name, course }) => {
  const existingStudent = await getStudentById(id);

  if (!existingStudent) {
    return null;
  }

  const result = await pool.query(
    `
    UPDATE students
    SET
      first_name = $1,
      last_name = $2,
      course = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING id, first_name, last_name, course, created_at, updated_at
    `,
    [
      first_name ?? existingStudent.first_name,
      last_name ?? existingStudent.last_name,
      course ?? existingStudent.course,
      id,
    ]
  );

  return result.rows[0];
};

const deleteStudent = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM students
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows[0] || null;
};

const upsertStudentInfo = async (studentId, { email, phone, address, notes }) => {
  const result = await pool.query(
    `
    INSERT INTO student_infos (student_id, email, phone, address, notes)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (student_id)
    DO UPDATE SET
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      address = EXCLUDED.address,
      notes = EXCLUDED.notes,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id, student_id, email, phone, address, notes, created_at, updated_at
    `,
    [studentId, email || null, phone || null, address || null, notes || null]
  );

  return result.rows[0];
};

const createSubject = async (studentId, { title, credits }) => {
  const result = await pool.query(
    `
    INSERT INTO subjects (student_id, title, credits)
    VALUES ($1, $2, $3)
    RETURNING id, student_id, title, credits, created_at, updated_at
    `,
    [studentId, title, credits]
  );

  return result.rows[0];
};

const updateSubject = async (subjectId, { title, credits }) => {
  const existingResult = await pool.query(
    `
    SELECT id, title, credits
    FROM subjects
    WHERE id = $1
    `,
    [subjectId]
  );

  if (existingResult.rows.length === 0) {
    return null;
  }

  const existingSubject = existingResult.rows[0];

  const result = await pool.query(
    `
    UPDATE subjects
    SET
      title = $1,
      credits = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING id, student_id, title, credits, created_at, updated_at
    `,
    [title ?? existingSubject.title, credits ?? existingSubject.credits, subjectId]
  );

  return result.rows[0];
};

const deleteSubject = async (subjectId) => {
  const result = await pool.query(
    `
    DELETE FROM subjects
    WHERE id = $1
    RETURNING id
    `,
    [subjectId]
  );

  return result.rows[0] || null;
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  upsertStudentInfo,
  createSubject,
  updateSubject,
  deleteSubject,
};