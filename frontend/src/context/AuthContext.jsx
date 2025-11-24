import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    if (savedUser) {
      setUsuario(JSON.parse(savedUser));
    }
    setCargando(false);
  }, []);

  function guardarSesion({ token, usuario }) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUsuario(usuario);
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  async function login(email, password) {
    const res = await api.post("/api/auth/login", { email, password });
    guardarSesion(res.data);
  }

  async function register(nombre, email, password) {
    const res = await api.post("/api/auth/register", { nombre, email, password });
    guardarSesion(res.data);
  }

  async function actualizarPerfil(nombre) {
    const res = await api.put("/api/auth/me", { nombre });
    const nuevoUsuario = res.data.usuario;
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
    return res.data.message;
  }

  async function cambiarPassword(actual, nueva) {
    const res = await api.put("/api/auth/password", { actual, nueva });
    return res.data.message;
  }

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, login, register, cerrarSesion, actualizarPerfil, cambiarPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
