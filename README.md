# Studentų registro sistema

Studentų registro sistema yra kliento-serverio architektūros web aplikacija, leidžianti kurti, peržiūrėti, redaguoti, šalinti ir filtruoti studentų įrašus.

Sistema sudaryta iš:

* Backend REST API: Node.js, Express.js, PostgreSQL
* Frontend UI: React
* Duomenys perduodami JSON formatu

## Funkcionalumas

Sistema leidžia:

* Sukurti naują studentą nurodant vardą, pavardę ir kursą
* Peržiūrėti visų studentų sąrašą
* Gauti konkretaus studento informaciją pagal ID
* Atnaujinti studento duomenis
* Pašalinti studentą iš registro
* Filtruoti studentus pagal ID, vardą, pavardę arba kursą
* Sukurti arba atnaujinti papildomą studento informaciją
* Priskirti studentui mokomuosius dalykus
* Redaguoti ir šalinti mokomuosius dalykus
* Pašalinus studentą, susiję duomenys pašalinami kaskadiniu būdu

## Duomenų bazės struktūra

Naudojama PostgreSQL reliacinė duomenų bazė.

Pagrindinės lentelės:

* `students`
* `student_infos`
* `subjects`

Ryšiai:

* Vienas studentas gali turėti vieną papildomos informacijos įrašą
* Vienas studentas gali turėti daug mokomųjų dalykų
* `student_infos` ir `subjects` lentelės turi ryšį su `students`
* Pašalinus studentą, susiję įrašai pašalinami automatiškai naudojant `ON DELETE CASCADE`

## Naudotos technologijos

Backend:

* Node.js
* Express.js
* PostgreSQL
* pg
* Zod
* dotenv
* cors
* nodemon

Frontend:

* React
* Vite
* Fetch API
* CSS

## Projekto struktūra

```text
studentu-registras/
├── backend/
│   ├── database/
│   │   └── init.sql
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

## Backend paleidimas lokaliai

### 1. Pereiti į backend katalogą

```bash
cd backend
```

### 2. Įdiegti priklausomybes

```bash
npm install
```

### 3. Sukurti `.env` failą

Backend kataloge reikia sukurti `.env` failą pagal `.env.example`.

Galimas `.env` turinys:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_registry
DB_USER=postgres
DB_PASSWORD=postgres
```

Jeigu jūsų PostgreSQL slaptažodis kitoks, reikia pakeisti `DB_PASSWORD` reikšmę.

### 4. Sukurti PostgreSQL duomenų bazę

Per pgAdmin arba kitą PostgreSQL įrankį reikia sukurti duomenų bazę:

```sql
CREATE DATABASE student_registry;
```

### 5. Paleisti duomenų bazės SQL skriptą

Sukūrus `student_registry` duomenų bazę, reikia atidaryti Query Tool ir paleisti failo turinį:

```text
backend/database/init.sql
```

Šis failas sukuria reikalingas lenteles:

* `students`
* `student_infos`
* `subjects`

Taip pat įrašo pradinius testinius duomenis.

### 6. Paleisti backend serverį

```bash
npm run dev
```

Backend serveris veikia adresu:

```text
http://localhost:3000
```

Health check endpointas:

```http
GET http://localhost:3000/api/health
```

Sėkmingas atsakymas:

```json
{
  "status": "success",
  "message": "Student registry API is running"
}
```

## Frontend paleidimas lokaliai

### 1. Pereiti į frontend katalogą

Iš pagrindinio projekto katalogo:

```bash
cd frontend
```

### 2. Įdiegti priklausomybes

```bash
npm install
```

### 3. Paleisti frontend aplikaciją

```bash
npm run dev
```

Frontend dažniausiai veikia adresu:

```text
http://localhost:5173
```

Frontend aplikacija per HTTP užklausas bendrauja su backend REST API adresu:

```text
http://localhost:3000/api
```

## REST API endpointai

### Health check

```http
GET /api/health
```

Patikrina, ar backend serveris veikia.

---

## Studentai

### Gauti visus studentus

```http
GET /api/students
```

### Filtruoti studentus

Galimi query parametrai:

```http
GET /api/students?id=1
GET /api/students?course=JavaScript
GET /api/students?first_name=Jonas
GET /api/students?last_name=Jonaitis
```

### Gauti konkretų studentą pagal ID

```http
GET /api/students/:id
```

Pavyzdys:

```http
GET /api/students/1
```

### Sukurti naują studentą

```http
POST /api/students
```

Request body:

```json
{
  "first_name": "Jonas",
  "last_name": "Jonaitis",
  "course": "JavaScript"
}
```

### Atnaujinti studentą

```http
PATCH /api/students/:id
```

Request body:

```json
{
  "first_name": "Jonas",
  "last_name": "Jonaitis",
  "course": "Full Stack"
}
```

Galima siųsti ir tik dalį laukų, pvz.:

```json
{
  "course": "React"
}
```

### Pašalinti studentą

```http
DELETE /api/students/:id
```

Pašalinus studentą, kartu pašalinami ir su juo susiję `student_infos` bei `subjects` įrašai.

---

## Studento papildoma informacija

### Sukurti arba atnaujinti studento informaciją

```http
POST /api/students/:id/info
PATCH /api/students/:id/info
```

Request body:

```json
{
  "email": "jonas@example.com",
  "phone": "+37060000000",
  "address": "Kaunas",
  "notes": "Papildoma informacija apie studentą"
}
```

---

## Mokomieji dalykai

### Priskirti studentui mokomąjį dalyką

```http
POST /api/students/:id/subjects
```

Request body:

```json
{
  "title": "JavaScript",
  "credits": 6
}
```

### Atnaujinti mokomąjį dalyką

```http
PATCH /api/students/subjects/:subjectId
```

Request body:

```json
{
  "title": "React",
  "credits": 5
}
```

### Pašalinti mokomąjį dalyką

```http
DELETE /api/students/subjects/:subjectId
```

## Validacija

Kuriant arba atnaujinant įrašus sistema atlieka įvesties validaciją.

Jeigu duomenys neteisingi, API grąžina klaidą JSON formatu.

Pavyzdys:

```json
{
  "status": "fail",
  "message": "Validation error",
  "errors": {
    "formErrors": [],
    "fieldErrors": {
      "body": [
        "Vardas turi būti bent 2 simbolių",
        "Pavardė turi būti bent 2 simbolių",
        "Kursas privalomas"
      ]
    }
  }
}
```

## Vienetiniai testai

Backend dalyje yra realizuoti vienetiniai testai, tikrinantys validacijos schemas.

Testų paleidimas:

```bash
cd backend
npm test
```

Testai naudoja Node.js integruotą test runnerį:

```bash
node --test
```

## Lokalaus paleidimo santrauka

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Testavimo pavyzdžiai su curl

### Patikrinti backend veikimą

```bash
curl http://localhost:3000/api/health
```

### Gauti studentų sąrašą

```bash
curl http://localhost:3000/api/students
```

### Sukurti studentą

```bash
curl -X POST http://localhost:3000/api/students \
-H "Content-Type: application/json" \
-d '{"first_name":"Petras","last_name":"Petraitis","course":"JavaScript"}'
```

### Filtruoti pagal kursą

```bash
curl "http://localhost:3000/api/students?course=JavaScript"
```

### Atnaujinti studentą

```bash
curl -X PATCH http://localhost:3000/api/students/1 \
-H "Content-Type: application/json" \
-d '{"course":"Full Stack"}'
```

### Pašalinti studentą

```bash
curl -X DELETE http://localhost:3000/api/students/1
```

## Autorius

Studentų registro sistema sukurta praktinio egzamino užduočiai.
