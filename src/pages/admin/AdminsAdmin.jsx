import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { adminRegister } from "../../services/adminFirebase";
import { GetAdmins, DeleteAdmin } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

export default function AdminsAdmin() {
    const [admins, SetAdmins] = useState([]);
    const [formData, SetFormData] = useState({ nombre: "", email: "", password: "" });
    const [showModal, SetShowModal] = useState(false);
    const { userData } = useAuth();
    const LoadAdmins = async () => {
        const data = await GetAdmins();
        SetAdmins(data);
    };
    const Save = async () => {
        try {
            await adminRegister(formData);
            SetShowModal(false);
            LoadAdmins();
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };
    const DropAdmin = async (id) => {
        const result = await Swal.fire({
            title: "¿Eliminar administrador?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
        });
        if (result.isConfirmed) {
            await DeleteAdmin(id);
            LoadAdmins();
        }
    };
    useEffect(() => {
        if (userData?.tipo === "superadmin") LoadAdmins();
    }, []);
    if (userData?.tipo !== "superadmin") return <p>Acceso no autorizado</p>;
    return (
        <div className="container mt-4">
            <h3>Administradores</h3>
            <button className="btn btn-primary" onClick={() => SetShowModal(true)}>Nuevo Administrador</button>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td>{admin.nombre}</td>
                            <td>{admin.email}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => DropAdmin(admin.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <div className="modal d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header"><h5>Nuevo Administrador</h5></div>
                            <div className="modal-body">
                                <input className="form-control mb-2" placeholder="Nombre"
                                onChange={(e) => SetFormData({ ...formData, nombre: e.target.value })} />
                                <input className="form-control mb-2" placeholder="Email"
                                onChange={(e) => SetFormData({ ...formData, email: e.target.value })} />
                                <input className="form-control mb-2" placeholder="Contraseña" type="password"
                                onChange={(e) => SetFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => SetShowModal(false)}>Cancelar</button>
                                <button className="btn btn-success" onClick={Save}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}