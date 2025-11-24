import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "./LoginPage.jsx"; // solo para reutilizar AuthLayout si quieres

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      await register(form.nombre, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e1f0e6",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "320px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "1rem", color: "#154d2f" }}>
          Crear cuenta
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Registrarme</button>
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
