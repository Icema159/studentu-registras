const express = require("express");

const studentController = require("../controllers/studentController");
const validate = require("../middleware/validate");
const {
  idParamSchema,
  subjectIdParamSchema,
  createStudentSchema,
  updateStudentSchema,
  createInfoSchema,
  createSubjectSchema,
  updateSubjectSchema,
} = require("../schemas/studentSchemas");

const router = express.Router();

router
  .route("/")
  .get(studentController.getStudents)
  .post(validate(createStudentSchema), studentController.createStudent);

router
  .route("/:id")
  .get(validate(idParamSchema), studentController.getStudent)
  .patch(validate(updateStudentSchema), studentController.updateStudent)
  .delete(validate(idParamSchema), studentController.deleteStudent);

router
  .route("/:id/info")
  .post(validate(createInfoSchema), studentController.upsertStudentInfo)
  .patch(validate(createInfoSchema), studentController.upsertStudentInfo);

router
  .route("/:id/subjects")
  .post(validate(createSubjectSchema), studentController.createSubject);

router
  .route("/subjects/:subjectId")
  .patch(validate(updateSubjectSchema), studentController.updateSubject)
  .delete(validate(subjectIdParamSchema), studentController.deleteSubject);

module.exports = router;