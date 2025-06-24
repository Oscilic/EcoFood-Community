import { Link } from "react-router-dom";

export default function UserHome() {
    return (
        <div className="container mt-4">
            <h2>Bienvenido a EcoFood</h2>
            <p>Explora productos disponibles o revisa tus solicitudes.</p>
                <div className="d-flex gap-3 mt-3">
                    <Link to="/cliente/productos" className="btn btn-primary">Ver Productos</Link>
                    <Link to="/cliente/pedidos" className="btn btn-success">Mis Solicitudes</Link>
                    <Link to="/cliente/perfil" className="btn btn-secondary">Editar Perfil</Link>
                </div>
        </div>
    );
}