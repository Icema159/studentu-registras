import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/api";

function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    id: "",
    first_name: "",
    last_name: "",
    course: "",
  });

  const [studentForm, setStudentForm] = useState({
    first_name: "",
    last_name: "",
    course: "",
  });

  const [editingStudentId, setEditingStudentId] = useState(null);

  const [infoForm, setInfoForm] = useState({
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [subjectForm, setSubjectForm] = useState({
    title: "",
    credits: "",
  });

  const [message, setMessage] = useState("");

  const buildQuery = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) {
        params.append(key, value.trim());
      }
    });

    return params.toString();
  };

  const loadStudents = async () => {
    try {
      const query = buildQuery();
      const response = await fetch(`${API_URL}/students${query ? `?${query}` : ""}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Nepavyko gauti studentų");
      }

      setStudents(result.data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadStudentById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/students/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Studentas nerastas");
      }

      setSelectedStudent(result.data);
      setInfoForm({
        email: result.data.info?.email || "",
        phone: result.data.info?.phone || "",
        address: result.data.info?.address || "",
        notes: result.data.info?.notes || "",
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleStudentSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = editingStudentId
        ? `${API_URL}/students/${editingStudentId}`
        : `${API_URL}/students`;

      const method = editingStudentId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Nepavyko išsaugoti studento");
      }

      setMessage(result.message);
      setStudentForm({
        first_name: "",
        last_name: "",
        course: "",
      });
      setEditingStudentId(null);
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudentId(student.id);
    setStudentForm({
      first_name: student.first_name,
      last_name: student.last_name,
      course: student.course,
    });
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm("Ar tikrai norite pašalinti studentą?")) return;

    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Nepavyko pašalinti studento");
      }

      setMessage(result.message);
      setSelectedStudent(null);
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleInfoSubmit = async (event) => {
    event.preventDefault();

    if (!selectedStudent) return;

    try {
      const response = await fetch(`${API_URL}/students/${selectedStudent.id}/info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(infoForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Nepavyko išsaugoti informacijos");
      }

      setMessage(result.message);
      await loadStudentById(selectedStudent.id);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSubjectSubmit = async (event) => {
    event.preventDefault();

    if (!selectedStudent) return;

    try {
      const response = await fetch(`${API_URL}/students/${selectedStudent.id}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subjectForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Nepavyko pridėti dalyko");
      }

      setMessage(result.message);
      setSubjectForm({
        title: "",
        credits: "",
      });
      await loadStudentById(selectedStudent.id);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEditSubject = async (subject) => {
    const title = prompt("Naujas dalyko pavadinimas:", subject.title);
    const credits = prompt("Naujas kreditų skaičius:", subject.credits);

    if (!title || !credits) return;

    try {
      const response = await fetch(`${API_URL}/students/subjects/${subject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          credits: Number(credits),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Nepavyko atnaujinti dalyko");
      }

      setMessage(result.message);
      await loadStudentById(selectedStudent.id);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!confirm("Ar tikrai norite pašalinti dalyką?")) return;

    try {
      const response = await fetch(`${API_URL}/students/subjects/${subjectId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Nepavyko pašalinti dalyko");
      }

      setMessage(result.message);
      await loadStudentById(selectedStudent.id);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="container">
      <h1>Studentų registro sistema</h1>

      {message && <p className="message">{message}</p>}

      <section className="card">
        <h2>{editingStudentId ? "Redaguoti studentą" : "Pridėti studentą"}</h2>

        <form onSubmit={handleStudentSubmit} className="form">
          <input
            placeholder="Vardas"
            value={studentForm.first_name}
            onChange={(e) =>
              setStudentForm({ ...studentForm, first_name: e.target.value })
            }
          />

          <input
            placeholder="Pavardė"
            value={studentForm.last_name}
            onChange={(e) =>
              setStudentForm({ ...studentForm, last_name: e.target.value })
            }
          />

          <input
            placeholder="Kursas"
            value={studentForm.course}
            onChange={(e) =>
              setStudentForm({ ...studentForm, course: e.target.value })
            }
          />

          <button type="submit">
            {editingStudentId ? "Atnaujinti" : "Pridėti"}
          </button>

          {editingStudentId && (
            <button
              type="button"
              onClick={() => {
                setEditingStudentId(null);
                setStudentForm({ first_name: "", last_name: "", course: "" });
              }}
            >
              Atšaukti
            </button>
          )}
        </form>
      </section>

      <section className="card">
        <h2>Filtravimas</h2>

        <div className="filters">
          <input
            placeholder="ID"
            value={filters.id}
            onChange={(e) => setFilters({ ...filters, id: e.target.value })}
          />
          <input
            placeholder="Vardas"
            value={filters.first_name}
            onChange={(e) =>
              setFilters({ ...filters, first_name: e.target.value })
            }
          />
          <input
            placeholder="Pavardė"
            value={filters.last_name}
            onChange={(e) =>
              setFilters({ ...filters, last_name: e.target.value })
            }
          />
          <input
            placeholder="Kursas"
            value={filters.course}
            onChange={(e) =>
              setFilters({ ...filters, course: e.target.value })
            }
          />

          <button onClick={loadStudents}>Filtruoti</button>
          <button
            onClick={() => {
              setFilters({ id: "", first_name: "", last_name: "", course: "" });
              setTimeout(loadStudents, 0);
            }}
          >
            Išvalyti
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Studentų sąrašas</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vardas</th>
              <th>Pavardė</th>
              <th>Kursas</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.course}</td>
                <td>
                  <button onClick={() => loadStudentById(student.id)}>
                    Peržiūrėti
                  </button>
                  <button onClick={() => handleEditStudent(student)}>
                    Redaguoti
                  </button>
                  <button onClick={() => handleDeleteStudent(student.id)}>
                    Šalinti
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selectedStudent && (
        <section className="card">
          <h2>Studento informacija</h2>

          <p>
            <strong>
              {selectedStudent.first_name} {selectedStudent.last_name}
            </strong>{" "}
            — {selectedStudent.course}
          </p>

          <form onSubmit={handleInfoSubmit} className="form">
            <input
              placeholder="El. paštas"
              value={infoForm.email}
              onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
            />
            <input
              placeholder="Telefonas"
              value={infoForm.phone}
              onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
            />
            <input
              placeholder="Adresas"
              value={infoForm.address}
              onChange={(e) =>
                setInfoForm({ ...infoForm, address: e.target.value })
              }
            />
            <input
              placeholder="Pastabos"
              value={infoForm.notes}
              onChange={(e) => setInfoForm({ ...infoForm, notes: e.target.value })}
            />
            <button type="submit">Išsaugoti info</button>
          </form>

          <h3>Mokomieji dalykai</h3>

          <form onSubmit={handleSubjectSubmit} className="form">
            <input
              placeholder="Dalyko pavadinimas"
              value={subjectForm.title}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, title: e.target.value })
              }
            />
            <input
              placeholder="Kreditai"
              type="number"
              value={subjectForm.credits}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, credits: e.target.value })
              }
            />
            <button type="submit">Pridėti dalyką</button>
          </form>

          <ul className="subjects">
            {selectedStudent.subjects.map((subject) => (
              <li key={subject.id}>
                {subject.title} — {subject.credits} kreditai
                <button onClick={() => handleEditSubject(subject)}>
                  Redaguoti
                </button>
                <button onClick={() => handleDeleteSubject(subject.id)}>
                  Šalinti
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

export default App;