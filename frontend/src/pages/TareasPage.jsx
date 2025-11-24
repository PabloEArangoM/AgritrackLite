import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function TareasPage() {
  const [tareas, setTareas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    tipo: "",
    fecha: "",
    responsable: "",
    estado: "Pendiente",
    lote: "",
  });
  const [error, setError] = useState("");

  async function cargarDatos() {
    try {
      setError("");
      const [resTareas, resLotes] = await Promise.all([
        api.get("/api/tareas"),
        api.get("/api/lotes"),
      ]);
      setTareas(resTareas.data);
      setLotes(resLotes.data);
    } catch (err) {
      console.error("Error cargando tareas/lotes:", err);
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
      titulo: "",
      tipo: "",
      fecha: "",
      responsable: "",
      estado: "Pendiente",
      lote: "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !form.titulo ||
      !form.tipo ||
      !form.fecha ||
      !form.responsable ||
      !form.lote
    ) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    try {
      setError("");
      if (editingId) {
        await api.put(`/api/tareas/${editingId}`, form);
      } else {
        await api.post("/api/tareas", form);
      }
      resetForm();
      await cargarDatos();
    } catch (err) {
      console.error("Error guardando tarea:", err);
      setError(err.response?.data?.message || "Error al guardar tarea");
    }
  }

  function empezarEdicion(t) {
    setEditingId(t._id);
    setForm({
      titulo: t.titulo,
      tipo: t.tipo,
      fecha: t.fecha ? new Date(t.fecha).toISOString().slice(0, 10) : "",
      responsable: t.responsable,
      estado: t.estado,
      lote: t.lote?._id || t.lote,
    });
  }

  async function borrarTarea(id) {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      setError("");
      await api.delete(`/api/tareas/${id}`);
      await cargarDatos();
    } catch (err) {
      console.error("Error eliminando tarea:", err);
      setError(err.response?.data?.message || "Error al eliminar tarea");
    }
  }

  async function cambiarEstado(id, nuevoEstado) {
    try {
      setError("");
      await api.put(`/api/tareas/${id}`, { estado: nuevoEstado });
      await cargarDatos();
    } catch (err) {
      console.error("Error cambiando estado:", err);
      setError(err.response?.data?.message || "Error al cambiar estado");
    }
  }

  const columnaStyle = {
    flex: 1,
    background: "#e5e7eb",
    borderRadius: "10px",
    padding: "0.75rem",
    minHeight: "200px",
  };

  const tarjetaStyle = {
    background: "#f9fafb",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
  };

  function renderColumna(titulo, estado) {
    const filtradas = tareas.filter((t) => t.estado === estado);
    return (
      <div style={columnaStyle}>
        <h2>{titulo}</h2>
        {filtradas.map((t) => (
          <div key={t._id} style={tarjetaStyle}>
            <strong>{t.titulo}</strong>
            <div>{t.tipo}</div>
            <div>
              Lote: {t.lote?.nombre || "-"} —{" "}
              {t.fecha ? new Date(t.fecha).toLocaleDateString() : ""}
            </div>
            <div>Resp: {t.responsable}</div>

            <div style={{ marginTop: "0.3rem", display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
              {estado !== "Pendiente" && (
                <button onClick={() => cambiarEstado(t._id, "Pendiente")}>
                  Pendiente
                </button>
              )}
              {estado !== "Hoy" && (
                <button onClick={() => cambiarEstado(t._id, "Hoy")}>Hoy</button>
              )}
              {estado !== "Hecha" && (
                <button onClick={() => cambiarEstado(t._id, "Hecha")}>
                  Hecha
                </button>
              )}
              <button onClick={() => empezarEdicion(t)}>Editar</button>
              <button onClick={() => borrarTarea(t._id)}>Eliminar</button>
            </div>
          </div>
        ))}
        {filtradas.length === 0 && (
          <p style={{ fontStyle: "italic", fontSize: "0.85rem" }}>
            No hay tareas en esta columna
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>Tareas</h1>

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
          <h2>{editingId ? "Editar tarea" : "Nueva tarea"}</h2>

          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <input
            type="text"
            name="tipo"
            placeholder="Tipo (riego, fertilización...)"
            value={form.tipo}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <input
            type="text"
            name="responsable"
            placeholder="Responsable"
            value={form.responsable}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

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

          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Hoy">Hoy</option>
            <option value="Hecha">Hecha</option>
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

        {/* Columnas Kanban */}
        <div style={{ flex: 1, display: "flex", gap: "1rem" }}>
          {renderColumna("Pendiente", "Pendiente")}
          {renderColumna("Hoy", "Hoy")}
          {renderColumna("Hecha", "Hecha")}
        </div>
      </section>
    </div>
  );
}
