import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function BusinessProfile() {
    const { user } = useAuth();
    const [business, SetBusiness] = useState(null);
    const [editing, SetEditing] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            const GetBusiness = async () => {
                const ref = doc(db, "usuarios", user.uid);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    SetBusiness(snap.data());
                }
            };
            GetBusiness();
        }
    }, [user]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        SetBusiness({ ...business, [name]: value });
    };
    const SaveChanges = async () => {
        try {
            const ref = doc(db, "usuarios", user.uid);
            await updateDoc(ref, {
                nombre: business.nombre,
                direccion: business.direccion,
                comuna: business.comuna,
                telefono: business.telefono,
            });
            Swal.fire("Perfil actualizado", "", "success");
            SetEditing(false);
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            Swal.fire("Error al actualizar perfil", error.message, "error");
        }
    };
    if (!business) return <p>Cargando perfil...</p>;
    return (
        <div className="container mt-4">
            <h2>Perfil Empresarial</h2>
            <div className="mb-3">
                <label>Nombre:</label>
                <input className="form-control" name="nombre" value={business.nombre || ""} onChange={handleChange} disabled={!editing}/>
            </div>
            <div className="mb-3">
                <label>Email:</label>
                <input className="form-control" value={business.email || ""} disabled/>
            </div>
            <div className="mb-3">
                <label>Rut:</label>
                <input className="form-control" value={business.rut || ""}disabled/>
            </div>
            <div className="mb-3">
                <label>Dirección:</label>
                <input className="form-control" name="direccion" value={business.direccion || ""} onChange={handleChange} disabled={!editing}/>
            </div>
            <div className="mb-3">
                <label>Comuna:</label>
                <input className="form-control" name="comuna" value={business.comuna || ""} onChange={handleChange} disabled={!editing}/>
            </div>
            <div className="mb-3">
                <label>Teléfono:</label>
                <input className="form-control" name="telefono" value={business.telefono || ""} onChange={handleChange} disabled={!editing}/>
            </div>
            {!editing ? (
                <button className="btn btn-primary" onClick={() => SetEditing(true)}>
                    Editar Perfil
                </button>
            ) : (
                <>
                    <button className="btn btn-success me-2" onClick={SaveChanges}>
                        Guardar Cambios
                    </button>
                    <button className="btn btn-secondary" onClick={() => SetEditing(false)}>
                        Cancelar
                    </button>
                </>
            )}
            <hr />
            <button className="btn btn-outline-dark mt-3" onClick={() => navigate("/business/products")}>
                Administrar Productos
            </button>
            <button className="btn btn-outline-primary mt-3 ms-2" onClick={() => navigate("/business/requests")} >
                Ver Solicitudes
            </button>
        </div>
    );
}
