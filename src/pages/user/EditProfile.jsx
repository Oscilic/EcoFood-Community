import '../../components/layouts/styles/GeneralStyle.css';
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ValidationModule } from "../../components/ValidationModule";

export default function EditProfile() {
    const { user } = useAuth();
    const [data, SetData] = useState(null);
    const [editing, SetEditing] = useState(false);
    const navigate = useNavigate();

    const textRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const phoneRegex = /^\+[0-9]{11}/;
    const addressRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/;

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
        if (!data.nombre || data.nombre.length < 8 || data.nombre.length > 100 || !textRegex.test(data.nombre)) {
            Swal.fire("Error", "El nombre debe tener entre 8 y 100 caracteres y solo letras y espacios.", "error");
            return;
        }
        if (data.direccion.length < 10 || data.direccion.length > 200 || !addressRegex.test(data.direccion)) {
            Swal.fire("Error", "La dirección debe tener entre 10 y 200 caracteres y solo letras, números y espacios.", "error");
            return;
        }
        if (data.telefono && !phoneRegex.test(data.telefono)) {
            Swal.fire("Error", "El teléfono debe tener el formato +569XXXXXXXX.", "error");
            return;
        }
        try {
            const ref = doc(db, "usuarios", user.uid);
            await updateDoc(ref, {
                nombre: data.nombre,
                telefono: data.telefono,
                direccion: data.direccion,
            });
            Swal.fire("Perfil actualizado", "", "success");
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
                <ValidationModule
                    label="Nombre"
                    name="nombre"
                    value={data.nombre || ""}
                    onChange={handleChange}
                    type="text"
                    required={true}
                    minLength={8}
                    maxLength={100}
                    regex={textRegex}
                    errorMessage="El nombre debe tener entre 8 y 100 caracteres y solo letras y espacios."
                    disabled={!editing}
                />
            </div>
            <div className="mb-3">
                <label>Email:</label>
                <input className="form-control" value={data.email} disabled />
            </div>
            <div className="mb-3">
                <ValidationModule
                    label="Teléfono"
                    name="telefono"
                    value={data.telefono || ""}
                    onChange={handleChange}
                    type="text"
                    required={false}
                    minLength={9}
                    maxLength={12}
                    regex={phoneRegex}
                    errorMessage="El teléfono debe tener el formato +569XXXXXXXX."
                    disabled={!editing}
                />
            </div>
            <div className="mb-3">
                <ValidationModule
                    label="Dirección"
                    name="direccion"
                    value={data.direccion || ""}
                    onChange={handleChange}
                    type="text"
                    required={true}
                    minLength={10}
                    maxLength={200}
                    regex={addressRegex}
                    errorMessage="La dirección debe tener entre 10 y 200 caracteres y solo letras, números y espacios."
                    disabled={!editing}
                />
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
