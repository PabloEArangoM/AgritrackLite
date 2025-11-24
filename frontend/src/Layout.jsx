import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

export default function Layout() {
  const { pathname } = useLocation();
  const { usuario, cerrarSesion } = useAuth();
  const { theme } = useTheme();

  const linkClass = (path) =>
    "sidebar-link" + (pathname === path ? " sidebar-link--active" : "");

  return (
    <div className="app-shell">
      <div className="app-shell-inner">
        {/* sidebar */}
        <aside className="sidebar">
          <h2 className="sidebar-title">AgriTrack Lite</h2>

          <nav className="sidebar-nav">
            <Link to="/" className={linkClass("/")}>
              Inicio
            </Link>
            <Link to="/lotes" className={linkClass("/lotes")}>
              Lotes
            </Link>
            <Link to="/tareas" className={linkClass("/tareas")}>
              Tareas
            </Link>
            <Link to="/labores" className={linkClass("/labores")}>
              Labores
            </Link>
            <Link to="/ajustes" className={linkClass("/ajustes")}>
              Ajustes
            </Link>
          </nav>

          <div className="sidebar-footer">
            <p>
              <strong>Usuario:</strong> {usuario?.nombre}
            </p>
            <p>
              <strong>Email:</strong> {usuario?.email}
            </p>
            <button className="btn-logout" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* contenido */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
