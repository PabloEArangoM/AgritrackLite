import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function SettingsPage() {
  const { usuario, actualizarPerfil, cambiarPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [pwdActual, setPwdActual] = useState("");
  const [pwdNueva, setPwdNueva] = useState("");
  const [mensajePerfil, setMensajePerfil] = useState("");
  const [mensajePwd, setMensajePwd] = useState("");
  const [errorPerfil, setErrorPerfil] = useState("");
  const [errorPwd, setErrorPwd] = useState("");

  async function handlePerfil(e) {
    e.preventDefault();
    try {
      setErrorPerfil("");
      const msg = await actualizarPerfil(nombre);
      setMensajePerfil(msg || "Perfil actualizado");
    } catch (err) {
      console.error(err);
      setMensajePerfil("");
      setErrorPerfil("No se pudo actualizar el perfil");
    }
  }

  async function handlePassword(e) {
    e.preventDefault();
    if (!pwdActual || !pwdNueva) {
      setErrorPwd("Completa ambos campos");
      return;
    }
    try {
      setErrorPwd("");
      const msg = await cambiarPassword(pwdActual, pwdNueva);
      setMensajePwd(msg || "Contraseña actualizada");
      setPwdActual("");
      setPwdNueva("");
    } catch (err) {
      console.error(err);
      setMensajePwd("");
      setErrorPwd(
        err.response?.data?.message || "No se pudo cambiar la contraseña"
      );
    }
  }

  const isDark = theme === "dark";

  return (
    <div>
      <h1>Ajustes</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "1.5rem",
          marginTop: "1rem",
        }}
      >
        {/* Perfil */}
        <section
          style={{
            background: isDark ? "#111827" : "#ffffff",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Perfil</h2>
          <form onSubmit={handlePerfil}>
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />

            <label>Correo (no editable)</label>
            <input
              type="email"
              value={usuario?.email}
              disabled
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />

            <button type="submit">Guardar cambios</button>

            {mensajePerfil && (
              <p style={{ color: "green", marginTop: "0.5rem" }}>{mensajePerfil}</p>
            )}
            {errorPerfil && (
              <p style={{ color: "red", marginTop: "0.5rem" }}>{errorPerfil}</p>
            )}
          </form>
        </section>

        {/* Tema */}
        <section
          style={{
            background: isDark ? "#111827" : "#ffffff",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Tema</h2>
          <p>Selecciona cómo quieres ver la aplicación:</p>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              marginTop: "0.5rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              border: "1px solid #9ca3af",
              cursor: "pointer",
            }}
          >
            Cambiar a modo {theme === "light" ? "oscuro" : "claro"}
          </button>
        </section>
      </div>

      {/* Contraseña */}
      <section
        style={{
          marginTop: "1.5rem",
          background: isDark ? "#111827" : "#ffffff",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          maxWidth: "480px",
        }}
      >
        <h2>Cambiar contraseña</h2>
        <form onSubmit={handlePassword}>
          <label>Contraseña actual</label>
          <input
            type="password"
            value={pwdActual}
            onChange={(e) => setPwdActual(e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <label>Contraseña nueva</label>
          <input
            type="password"
            value={pwdNueva}
            onChange={(e) => setPwdNueva(e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />

          <button type="submit">Actualizar contraseña</button>

          {mensajePwd && (
            <p style={{ color: "green", marginTop: "0.5rem" }}>{mensajePwd}</p>
          )}
          {errorPwd && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>{errorPwd}</p>
          )}
        </form>
      </section>
    </div>
  );
}
