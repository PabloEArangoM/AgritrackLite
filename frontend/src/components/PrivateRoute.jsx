import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
