import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./styles/NavigationLayout.css";

export default function NavigationLayout() {
  const { currentUser, user, userData, logout } = useAuth();
  const displayName =
  (userData && userData.nombre) ||
  (user && user.displayName) ||
  (user && user.email) ||
  currentUser || 
  "Usuario";
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useAuth().userData?.tipo || "cliente";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const sidebarLinksByRole = {
    admin: [
      {path: "/admin/dashboard", label: "Inicio"},
      {path: "/admin/users", label: "Clientes"},
      {path: "/admin/business", label: "Empresas"},
      {path: "/admin/management", label: "Administradores"}
    ],
    empresa: [
      {path: "/business/products", label: "Productos"},
      {path: "/business/requests", label: "Solicitudes"}
    ],
    cliente: [
      {path: "/client/home", label: "Inicio"},
      {path: "/client/products", label: "Productos"},
      {path: "/client/orders", label: "Pedidos"}
    ]
  };
  sidebarLinksByRole.superadmin = sidebarLinksByRole.admin;
  useEffect(() => {
    const roleTranslations = {
      admin: "administrador",
      empresa: "empresa",
      cliente: "cliente",
      superadmin: "administrador",
    }
    document.title = `Panel de ${roleTranslations[userRole] || "usuario"}`;
  }, [userRole]);
  const sidebarLinks = sidebarLinksByRole[userRole] || [];
  return (
    <div style={{minHeight: "100vh", display: "flex"}}>
      <aside className="p-3" id="navsidebar" style={{ width: "250px"}}>
        <h5 className="mb-4" id="navsidebarHead">Panel de acceso</h5>
        <nav className="d-flex flex-column gap-2">
          {sidebarLinks.map((link) => (
            <button
            key={link.path}
            className={`btn btn-link mt-2 text-start text-decoration-none${location.pathname === link.path ? " active " : ""}`}
            id="navlink"
            style={{ width: "100%" }}
            onClick={() => navigate(link.path)}
            disabled={location.pathname === link.path}>
              {link.label}
            </button>
          ))}
        </nav>
      </aside>
      <div style={{flex:1, minHeight: "100vh", display: "flex", flexDirection: "column"}}>
        <div className="d-flex justify-content-end p-3" id="profilebar" ref={dropdownRef}>
            <div className="position-relative">
              <button className="btn btn-outline dropdown-toggle" type="button" onClick={() => setDropdownOpen(open => !open)} aria-expanded={dropdownOpen}>
                {displayName}
              </button>
              <ul className={`dropdown-menu${dropdownOpen ? " show" : ""}`} style={{ position: "absolute", right: 0 }} id="profileDropdown">
                {(userRole === "empresa" || userRole === "empresa") && (
                  <>
                    <li id="profileDropdownItem">
                      <button 
                        className="dropdown-item" 
                        onClick={() => { 
                          setDropdownOpen(false);
                          if (userRole === "cliente") navigate("/client/profile"); 
                          else if(userRole === "empresa") navigate("/business/profile")}}>
                        Editar Perfil
                      </button>
                    </li>
                    <li><hr className="dropdown-divider"/></li>
                  </>
                  )}
                <li>
                  <button id="profileDropdownLogout" className="dropdown-item" onClick={() => {
                    setDropdownOpen(false);
                    logout();}}>
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}