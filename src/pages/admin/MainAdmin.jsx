import { useEffect, useState } from "react";
import { GetAdmins, DeleteAdmin } from "../../services/userService";
import { adminRegister } from "../../services/adminFirebase";
import Swal from "sweetalert2";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function MainAdmin() {
    const [admins, SetAdmins] = useState([]);
    const [formData, SetFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        id: null
    });
    const [editMode, SetEditMode] = useState(false);
    const LoadAdmins = async () => {
        const data = await GetAdmins();
        SetAdmins(data);
    };
    const IsComplexPassword = (password) => {
        const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editMode && !IsComplexPassword(formData.password)) {
            return Swal.fire("Contraseña débil", "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.", "error");
        }
        try {
            if (editMode) {
                const ref = doc(db, "usuarios", formData.id);
                await updateDoc(ref, {
                nombre: formData.nombre,
                email: formData.email,
                });
                Swal.fire("Actualizado", "Administrador actualizado correctamente", "success");
            } else {
                await adminRegister(formData);
                Swal.fire("Creado", "Administrador registrado correctamente", "success");
            }
            SetFormData({ nombre: "", email: "", password: "", id: null });
            SetEditMode(false);
            LoadAdmins();
        } catch (error){
            console.error("Error: ", error)
        }
    };
    const DropAdmin = async (id) => {
        const result = await Swal.fire({
            title: "¿Eliminar administrador?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí"
        });
        if (result.isConfirmed) {
            try {
                await DeleteAdmin(id);
                Swal.fire("Eliminado", "Administrador eliminado correctamente", "success");
                LoadAdmins();
            } catch (error) {
                Swal.fire("Error", "No se pudo eliminar", "error");
                console.error("Error al eliminar al administrador: ", error)
            }
        }
    };
    const EditAdmin = (admin) => {
        SetFormData({
            nombre: admin.nombre,
            email: admin.email,
            password: "",
            id: admin.id
        });
        SetEditMode(true);
    };
    useEffect(() => {
        LoadAdmins();
    }, []);
    return (
        <div className="container mt-4">
        <h2>Administración Principal</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                className="form-control mb-2"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={e => SetFormData({ ...formData, nombre: e.target.value })}
                required
                />
                <input
                className="form-control mb-2"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={e => SetFormData({ ...formData, email: e.target.value })}
                required
                />
                {!editMode && (
                <input
                    className="form-control mb-2"
                    type="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={e => SetFormData({ ...formData, password: e.target.value })}
                    required
                />
                )}
                <button className="btn btn-primary">
                    {editMode ? "Actualizar Admin" : "Registrar Admin"}
                </button>
                {editMode && (
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => {
                    SetEditMode(false);
                    SetFormData({ nombre: "", email: "", password: "", id: null });
                    }}>
                    Cancelar
                </button>
                )}
            </form>
            <table className="table">
                <thead>
                    <tr><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {admins.map(admin => (
                        <tr key={admin.id}>
                            <td>{admin.nombre}</td>
                            <td>{admin.email}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => EditAdmin(admin)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => DropAdmin(admin.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}