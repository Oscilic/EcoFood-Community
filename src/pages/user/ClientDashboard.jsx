import React from "react";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = React.useState(null);
    const cards = [
        { key: "productos", label: "Visualizar Productos", desc: "Busca y solicita productos disponibles.", path: "/client/products" },
        { key: "solicitudes", label: "Mis Solicitudes", desc: "Revisa el estado de tus pedidos y solicitudes.", path: "/client/orders" },
        { key: "perfil", label: "Editar Perfil", desc: "Modifica tu información personal.", path: "/client/profile" },
    ];
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">¡Bienvenido a EcoFood!</h1>
            <p className="dashboard-description">
                Desde aquí puedes acceder a los productos disponibles, tus solicitudes y editar tu perfil.
            </p>
            <div className="dashboard-cards">
                {cards.map(({ key, label, desc, path }) => (
                <div
                    key={key}
                    className={`dashboard-card ${hovered === key ? "hovered" : ""}`}
                    onClick={() => navigate(path)}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "pointer", padding: "20px", border: "1px solid #ccc", margin: "10px", borderRadius: "8px", transition: "0.3s", backgroundColor: hovered === key ? "#f0f8ff" : "white" }}>
                    <h2 className="card-title">{label}</h2>
                    <p className="card-desc">{desc}</p>
                </div>
                ))}
            </div>
        </div>
    );
};
export default ClientDashboard;