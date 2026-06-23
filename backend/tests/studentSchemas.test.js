const test = require("node:test");
const assert = require("node:assert");

const {
  createStudentSchema,
  createSubjectSchema,
} = require("../src/schemas/studentSchemas");

test("createStudentSchema accepts valid student data", () => {
  const result = createStudentSchema.safeParse({
    body: {
      first_name: "Jonas",
      last_name: "Jonaitis",
      course: "JavaScript",
    },
  });

  assert.strictEqual(result.success, true);
});

test("createStudentSchema rejects empty student fields", () => {
  const result = createStudentSchema.safeParse({
    body: {
      first_name: "",
      last_name: "",
      course: "",
    },
  });

  assert.strictEqual(result.success, false);
});

test("createSubjectSchema accepts valid subject data", () => {
  const result = createSubjectSchema.safeParse({
    params: {
      id: 1,
    },
    body: {
      title: "JavaScript",
      credits: 6,
    },
  });

  assert.strictEqual(result.success, true);
});

test("createSubjectSchema rejects invalid credits", () => {
  const result = createSubjectSchema.safeParse({
    params: {
      id: 1,
    },
    body: {
      title: "JavaScript",
      credits: 0,
    },
  });

  assert.strictEqual(result.success, false);
});