import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useTheme } from "../context/ThemeContext";

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [lotes, setLotes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [labores, setLabores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setError("");
        const [resLotes, resTareas, resLabores] = await Promise.all([
          api.get("/api/lotes"),
          api.get("/api/tareas"),
          api.get("/api/labores"),
        ]);
        setLotes(resLotes.data);
        setTareas(resTareas.data);
        setLabores(resLabores.data);
      } catch (err) {
        console.error("Error cargando resumen:", err);
        setError(err.response?.data?.message || "Error al cargar el inicio");
      }
    }
    cargar();
  }, []);

  // métricas
  const totalLotes = lotes.length;
  const tareasPendientes = tareas.filter((t) => t.estado !== "Hecha").length;
  const costoTotal = labores.reduce((acc, l) => acc + (l.costo || 0), 0);

  // últimos lotes (por fecha de actualización)
  const ultimosLotes = [...lotes]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 3);

  // próximas tareas (que NO estén hechas, ordenadas por fecha asc)
  const proximasTareas = [...tareas]
    .filter((t) => t.estado !== "Hecha" && t.fecha)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, 3);

  // últimas labores
  const ultimasLabores = [...labores]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha)
    )
    .slice(0, 3);

  const cardStyle = {
    flex: 1,
    background: isDark ? "#111827" : "#ffffff",
    color: isDark ? "#e5e7eb" : "#111827",
    padding: "0.9rem 1rem",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    minWidth: "0",
  };

  const smallTitle = {
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: isDark ? "#9ca3af" : "#6b7280",
  };

  const bigValue = {
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginTop: "0.25rem",
  };

  const listItemStyle = {
    padding: "0.4rem 0.2rem",
    borderBottom: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
    fontSize: "0.9rem",
  };

  return (
    <div>
      <h1>Inicio</h1>
      <p style={{ marginTop: "0.25rem", color: isDark ? "#9ca3af" : "#4b5563" }}>
        Resumen rápido de tu operación agrícola.
      </p>

      {/* Métricas principales */}
      <section
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={cardStyle}>
          <div style={smallTitle}>Lotes totales</div>
          <div style={bigValue}>{totalLotes}</div>
          <p style={{ marginTop: "0.25rem", fontSize: "0.85rem" }}>
            Todos los lotes que tienes registrados en AgriTrack Lite.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={smallTitle}>Tareas abiertas</div>
          <div style={bigValue}>{tareasPendientes}</div>
          <p style={{ marginTop: "0.25rem", fontSize: "0.85rem" }}>
            Tareas que aún no están marcadas como <strong>Hecha</strong>.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={smallTitle}>Costo total labores</div>
          <div style={bigValue}>${costoTotal.toLocaleString()}</div>
          <p style={{ marginTop: "0.25rem", fontSize: "0.85rem" }}>
            Suma de los costos de todas las labores registradas.
          </p>
        </div>
      </section>

      {/* Últimos cambios */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        {/* Últimos lotes */}
        <div style={cardStyle}>
          <h2 style={{ marginBottom: "0.5rem" }}>Últimos lotes</h2>
          {ultimosLotes.length === 0 ? (
            <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
              Aún no has registrado lotes.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {ultimosLotes.map((l) => (
                <li key={l._id} style={listItemStyle}>
                  <div>
                    <strong>{l.nombre}</strong> · {l.cultivo} ·{" "}
                    <span
                      style={{
                        padding: "0.05rem 0.4rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        background: isDark ? "#1f2937" : "#e5f3ea",
                      }}
                    >
                      {l.estado}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: isDark ? "#9ca3af" : "#6b7280" }}>
                    Siembra:{" "}
                    {l.fechaSiembra
                      ? new Date(l.fechaSiembra).toLocaleDateString()
                      : "—"}{" "}
                    · Última act.:{" "}
                    {l.updatedAt
                      ? new Date(l.updatedAt).toLocaleString()
                      : new Date(l.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Próximas tareas */}
        <div style={cardStyle}>
          <h2 style={{ marginBottom: "0.5rem" }}>Próximas tareas</h2>
          {proximasTareas.length === 0 ? (
            <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
              No hay tareas próximas. 👍
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {proximasTareas.map((t) => (
                <li key={t._id} style={listItemStyle}>
                  <div>
                    <strong>{t.titulo}</strong>{" "}
                    <span
                      style={{
                        padding: "0.05rem 0.4rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        background: isDark ? "#1f2937" : "#e5f0ff",
                      }}
                    >
                      {t.estado}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: isDark ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    {t.tipo} · Lote: {t.lote?.nombre || "-"} ·{" "}
                    {t.fecha
                      ? new Date(t.fecha).toLocaleDateString()
                      : "Sin fecha"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Últimas labores */}
      <section style={{ marginTop: "1.5rem" }}>
        <div style={cardStyle}>
          <h2>Últimas labores registradas</h2>
          {ultimasLabores.length === 0 ? (
            <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
              Aún no has registrado labores.
            </p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "0.5rem",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.4rem 0.5rem",
                      borderBottom: "1px solid #d1d5db",
                    }}
                  >
                    Lote
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.4rem 0.5rem",
                      borderBottom: "1px solid #d1d5db",
                    }}
                  >
                    Fecha
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.4rem 0.5rem",
                      borderBottom: "1px solid #d1d5db",
                    }}
                  >
                    Categoría
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0.4rem 0.5rem",
                      borderBottom: "1px solid #d1d5db",
                    }}
                  >
                    Costo
                  </th>
                </tr>
              </thead>
              <tbody>
                {ultimasLabores.map((l) => (
                  <tr key={l._id}>
                    <td
                      style={{
                        padding: "0.35rem 0.5rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {l.lote?.nombre || "-"}
                    </td>
                    <td
                      style={{
                        padding: "0.35rem 0.5rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {l.fecha
                        ? new Date(l.fecha).toLocaleDateString()
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: "0.35rem 0.5rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {l.categoria}
                    </td>
                    <td
                      style={{
                        padding: "0.35rem 0.5rem",
                        borderBottom: "1px solid #e5e7eb",
                        textAlign: "right",
                      }}
                    >
                      ${(l.costo || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {error && (
        <p style={{ color: "red", marginTop: "0.75rem" }}>{error}</p>
      )}
    </div>
  );
}
