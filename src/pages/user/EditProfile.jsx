import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const { user } = useAuth();
    const [data, SetData] = useState(null);
    const [editing, SetEditing] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const obtener = async () => {
            const ref = doc(db, "usuarios", user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) SetData(snap.data());
        };
        if (user) obtener();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        SetData({ ...data, [name]: value });
    };

    const save = async () => {
        try {
            const ref = doc(db, "usuarios", user.uid);
            await updateDoc(ref, {
                nombre: data.nombre,
                telefono: data.telefono,
                direccion: data.direccion,
            });
            Swal.fire("erfil actualizado", "", "success");
            SetEditing(false);
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };
    if (!data) return <p>Cargando...</p>;
    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                ← Volver
            </button>
            <h2>Editar Perfil</h2>
            <div className="mb-3">
                <label>Nombre:</label>
                <input className="form-control" name="nombre" value={data.nombre} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="mb-3">
                <label>Email:</label>
                <input className="form-control" value={data.email} disabled />
            </div>
            <div className="mb-3">
                <label>Teléfono:</label>
                <input className="form-control" name="telefono" value={data.telefono} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="mb-3">
                <label>Dirección:</label>
                <input className="form-control" name="direccion" value={data.direccion} onChange={handleChange} disabled={!editing} />
            </div>
            {!editing ? (
                <button className="btn btn-primary" onClick={() => SetEditing(true)}>Editar</button>
            ) : (
                <>
                    <button className="btn btn-success me-2" onClick={save}>Guardar</button>
                    <button className="btn btn-secondary" onClick={() => SetEditing(false)}>Cancelar</button>
                </>
            )}
        </div>
    );
}
