const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const studentModel = require("../models/studentModel");

const getStudents = catchAsync(async (req, res) => {
  const students = await studentModel.getAllStudents(req.query);

  res.json({
    status: "success",
    results: students.length,
    data: students,
  });
});

const getStudent = catchAsync(async (req, res, next) => {
  const { id } = req.validated.params;

  const student = await studentModel.getStudentById(id);

  if (!student) {
    return next(new AppError("Studentas nerastas", 404));
  }

  res.json({
    status: "success",
    data: student,
  });
});

const createStudent = catchAsync(async (req, res) => {
  const student = await studentModel.createStudent(req.validated.body);

  res.status(201).json({
    status: "success",
    message: "Studentas sukurtas",
    data: student,
  });
});

const updateStudent = catchAsync(async (req, res, next) => {
  const { id } = req.validated.params;

  const student = await studentModel.updateStudent(id, req.validated.body);

  if (!student) {
    return next(new AppError("Studentas nerastas", 404));
  }

  res.json({
    status: "success",
    message: "Studentas atnaujintas",
    data: student,
  });
});

const deleteStudent = catchAsync(async (req, res, next) => {
  const { id } = req.validated.params;

  const deletedStudent = await studentModel.deleteStudent(id);

  if (!deletedStudent) {
    return next(new AppError("Studentas nerastas", 404));
  }

  res.json({
    status: "success",
    message: "Studentas pašalintas kartu su susijusiais duomenimis",
  });
});

const upsertStudentInfo = catchAsync(async (req, res, next) => {
  const { id } = req.validated.params;

  const student = await studentModel.getStudentById(id);

  if (!student) {
    return next(new AppError("Studentas nerastas", 404));
  }

  const info = await studentModel.upsertStudentInfo(id, req.validated.body);

  res.status(201).json({
    status: "success",
    message: "Studento informacija išsaugota",
    data: info,
  });
});

const createSubject = catchAsync(async (req, res, next) => {
  const { id } = req.validated.params;

  const student = await studentModel.getStudentById(id);

  if (!student) {
    return next(new AppError("Studentas nerastas", 404));
  }

  const subject = await studentModel.createSubject(id, req.validated.body);

  res.status(201).json({
    status: "success",
    message: "Mokomasis dalykas priskirtas studentui",
    data: subject,
  });
});

const updateSubject = catchAsync(async (req, res, next) => {
  const { subjectId } = req.validated.params;

  const subject = await studentModel.updateSubject(subjectId, req.validated.body);

  if (!subject) {
    return next(new AppError("Mokomasis dalykas nerastas", 404));
  }

  res.json({
    status: "success",
    message: "Mokomasis dalykas atnaujintas",
    data: subject,
  });
});

const deleteSubject = catchAsync(async (req, res, next) => {
  const { subjectId } = req.validated.params;

  const deletedSubject = await studentModel.deleteSubject(subjectId);

  if (!deletedSubject) {
    return next(new AppError("Mokomasis dalykas nerastas", 404));
  }

  res.json({
    status: "success",
    message: "Mokomasis dalykas pašalintas",
  });
});

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  upsertStudentInfo,
  createSubject,
  updateSubject,
  deleteSubject,
};