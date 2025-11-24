import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function LaboresPage() {
  const [labores, setLabores] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    lote: "",
    fecha: "",
    categoria: "",
    insumo: "",
    dosis: "",
    costo: "",
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

  const cellRight = {
    ...cellStyle,
    textAlign: "right",
  };

  const totalCosto = labores.reduce((acc, l) => acc + (l.costo || 0), 0);

  async function cargarDatos() {
    try {
      setError("");
      const [resLabores, resLotes] = await Promise.all([
        api.get("/api/labores"),
        api.get("/api/lotes"),
      ]);
      setLabores(resLabores.data);
      setLotes(resLotes.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(err.response?.data?.message || "Error al cargar datos");
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      lote: "",
      fecha: "",
      categoria: "",
      insumo: "",
      dosis: "",
      costo: "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !form.lote ||
      !form.fecha ||
      !form.categoria ||
      !form.insumo ||
      !form.dosis ||
      form.costo === ""
    ) {
      alert("Completa todos los campos");
      return;
    }

    try {
      setError("");
      const payload = { ...form, costo: Number(form.costo) };

      if (editingId) {
        await api.put(`/api/labores/${editingId}`, payload);
      } else {
        await api.post("/api/labores", payload);
      }

      resetForm();
      await cargarDatos();
    } catch (err) {
      console.error("Error guardando labor:", err);
      setError(err.response?.data?.message || "Error al guardar labor");
    }
  }

  async function borrarLabor(id) {
    if (!confirm("¿Eliminar esta labor?")) return;
    try {
      setError("");
      await api.delete(`/api/labores/${id}`);
      await cargarDatos();
    } catch (err) {
      console.error("Error eliminando labor:", err);
      setError(err.response?.data?.message || "Error al eliminar labor");
    }
  }

  function empezarEdicion(l) {
    setEditingId(l._id);
    setForm({
      lote: l.lote?._id || l.lote,
      fecha: l.fecha ? new Date(l.fecha).toISOString().slice(0, 10) : "",
      categoria: l.categoria,
      insumo: l.insumo,
      dosis: l.dosis,
      costo: l.costo != null ? String(l.costo) : "",
    });
  }

  return (
    <div>
      <h1>Labores</h1>

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
          <h2>{editingId ? "Editar labor" : "Nueva labor"}</h2>

          <label>Lote</label>
          <select
            name="lote"
            value={form.lote}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          >
            <option value="">Selecciona un lote</option>
            {lotes.map((l) => (
              <option key={l._id} value={l._id}>
                {l.nombre}
              </option>
            ))}
          </select>

          <label>Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <label>Categoría</label>
          <input
            type="text"
            name="categoria"
            placeholder="Fertilización, riego..."
            value={form.categoria}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <label>Insumo</label>
          <input
            type="text"
            name="insumo"
            value={form.insumo}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <label>Dosis</label>
          <input
            type="text"
            name="dosis"
            value={form.dosis}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <label>Costo (COP)</label>
          <input
            type="number"
            name="costo"
            value={form.costo}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit">
              {editingId ? "Guardar cambios" : "Guardar labor"}
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

        {/* Tabla de labores */}
        <div style={{ flex: 1 }}>
          <h2>
            Labores registradas (costo total: $
            {totalCosto.toLocaleString()})
          </h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Lote</th>
                <th style={headerCellStyle}>Fecha</th>
                <th style={headerCellStyle}>Categoría</th>
                <th style={headerCellStyle}>Insumo</th>
                <th style={headerCellStyle}>Dosis</th>
                <th style={headerCellStyle}>Costo</th>
                <th style={headerCellStyle}></th>
              </tr>
            </thead>
            <tbody>
              {labores.map((l) => (
                <tr key={l._id}>
                  <td style={cellStyle}>{l.lote?.nombre || "-"}</td>
                  <td style={cellStyle}>
                    {l.fecha ? new Date(l.fecha).toLocaleDateString() : ""}
                  </td>
                  <td style={cellStyle}>{l.categoria}</td>
                  <td style={cellStyle}>{l.insumo}</td>
                  <td style={cellStyle}>{l.dosis}</td>
                  <td style={cellRight}>
                    ${(l.costo || 0).toLocaleString()}
                  </td>
                  <td style={cellStyle}>
                    <button onClick={() => empezarEdicion(l)}>Editar</button>
                    <button
                      onClick={() => borrarLabor(l._id)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {labores.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      ...cellStyle,
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    No hay labores registradas
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
