import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";

export default function AdminLayout() {
  const { usuario, logout } = useAuth();

  useEffect(() => {
    document.title = "Panel de Administración - EcoFood";
  }, []);

  return (
    <div className="admin-layout">
      {/* Barra superior horizontal fija */}
      <header className="admin-topbar">
        <h1 className="admin-topbar-title">EcoFood Admin</h1>
        <nav className="admin-topbar-nav">
          <Link to="/admin/clientes" className="admin-topbar-link">Clientes</Link>
          <Link to="/admin/empresas" className="admin-topbar-link">Empresas</Link>
          <Link to="/admin/registro" className="admin-topbar-link">Registrar Admin</Link>
        </nav>
        <button
          onClick={logout}
          className="admin-topbar-logout"
        >
          Cerrar Sesión
        </button>
      </header>
      {/* Contenido principal */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}