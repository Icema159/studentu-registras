const { z } = require("zod");

const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

const subjectIdParamSchema = z.object({
  params: z.object({
    subjectId: z.coerce.number().int().positive(),
  }),
});

const createStudentSchema = z.object({
  body: z.object({
    first_name: z.string().min(2, "Vardas turi būti bent 2 simbolių"),
    last_name: z.string().min(2, "Pavardė turi būti bent 2 simbolių"),
    course: z.string().min(2, "Kursas privalomas"),
  }),
});

const updateStudentSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    first_name: z.string().min(2).optional(),
    last_name: z.string().min(2).optional(),
    course: z.string().min(2).optional(),
  }),
});

const createInfoSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    email: z.string().email("Netinkamas el. paštas").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
  }),
});

const createSubjectSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    title: z.string().min(2, "Dalyko pavadinimas privalomas"),
    credits: z.coerce.number().int().positive("Kreditai turi būti teigiamas skaičius"),
  }),
});

const updateSubjectSchema = z.object({
  params: z.object({
    subjectId: z.coerce.number().int().positive(),
  }),
  body: z.object({
    title: z.string().min(2).optional(),
    credits: z.coerce.number().int().positive().optional(),
  }),
});

module.exports = {
  idParamSchema,
  subjectIdParamSchema,
  createStudentSchema,
  updateStudentSchema,
  createInfoSchema,
  createSubjectSchema,
  updateSubjectSchema,
};