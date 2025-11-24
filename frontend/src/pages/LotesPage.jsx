import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function LotesPage() {
  const [lotes, setLotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    cultivo: "",
    fechaSiembra: "",
    estado: "Planeado",
  });
  const [error, setError] = useState("");

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "#ffffff",
  };

  const headerCellStyle = {
    padding: "0.5rem 0.75rem",
    textAlign: "left",
    borderBottom: "1px solid #d1d5db",
    fontWeight: 600,
  };

  const cellStyle = {
    padding: "0.5rem 0.75rem",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "0.95rem",
  };

  async function cargarLotes() {
    try {
      setError("");
      const res = await api.get("/api/lotes");
      setLotes(res.data);
    } catch (err) {
      console.error("Error cargando lotes:", err);
      setError(err.response?.data?.message || "Error al cargar lotes");
    }
  }

  useEffect(() => {
    cargarLotes();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      nombre: "",
      cultivo: "",
      fechaSiembra: "",
      estado: "Planeado",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.cultivo || !form.fechaSiembra) {
      alert("Completa nombre, cultivo y fecha de siembra");
      return;
    }

    try {
      setError("");
      if (editingId) {
        await api.put(`/api/lotes/${editingId}`, form);
      } else {
        await api.post("/api/lotes", form);
      }
      resetForm();
      await cargarLotes();
    } catch (err) {
      console.error("Error guardando lote:", err);
      setError(err.response?.data?.message || "Error al guardar el lote");
    }
  }

  async function borrarLote(id) {
    if (!confirm("¿Eliminar este lote? (También se borrarán sus tareas y labores)")) return;
    try {
      setError("");
      await api.delete(`/api/lotes/${id}`);
      await cargarLotes();
    } catch (err) {
      console.error("Error eliminando lote:", err);
      setError(err.response?.data?.message || "Error al eliminar el lote");
    }
  }

  function empezarEdicion(lote) {
    setEditingId(lote._id);
    setForm({
      nombre: lote.nombre,
      cultivo: lote.cultivo,
      fechaSiembra: lote.fechaSiembra
        ? new Date(lote.fechaSiembra).toISOString().slice(0, 10)
        : "",
      estado: lote.estado || "Planeado",
    });
  }

  return (
    <div>
      <h1>Lotes</h1>

      <section style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            minWidth: "260px",
          }}
        >
          <h2>{editingId ? "Editar lote" : "Nuevo lote"}</h2>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <input
            type="text"
            name="cultivo"
            placeholder="Cultivo"
            value={form.cultivo}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <input
            type="date"
            name="fechaSiembra"
            value={form.fechaSiembra}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          >
            <option>Planeado</option>
            <option>En proceso</option>
            <option>Cosechado</option>
          </select>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit">
              {editingId ? "Guardar cambios" : "Crear"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>

          {error && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
          )}
        </form>

        {/* Tabla */}
        <div style={{ flex: 1 }}>
          <h2>Lista de lotes</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Nombre</th>
                <th style={headerCellStyle}>Cultivo</th>
                <th style={headerCellStyle}>Fecha siembra</th>
                <th style={headerCellStyle}>Estado</th>
                <th style={headerCellStyle}></th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((l) => (
                <tr key={l._id}>
                  <td style={cellStyle}>{l.nombre}</td>
                  <td style={cellStyle}>{l.cultivo}</td>
                  <td style={cellStyle}>
                    {l.fechaSiembra
                      ? new Date(l.fechaSiembra).toLocaleDateString()
                      : ""}
                  </td>
                  <td style={cellStyle}>{l.estado}</td>
                  <td style={cellStyle}>
                    <button onClick={() => empezarEdicion(l)}>Editar</button>
                    <button
                      onClick={() => borrarLote(l._id)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {lotes.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      ...cellStyle,
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    No hay lotes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {error && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
          )}
        </div>
      </section>
    </div>
  );
}
