import '../../components/layouts/styles/GeneralStyle.css';
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
    }, [userData]);
    if (userData?.tipo !== "superadmin") return <p>Acceso no autorizado</p>;
    return (
        <div className="container mt-4">
            <h3 className="my-3">Administradores</h3>
            <button className="btn btn-primary my-2" onClick={() => SetShowModal(true)}>Nuevo Administrador</button>
            <div className="container text-center mt-3">
                <div className="row">
                        <div className="col col-sm-2">Nombre</div>
                        <div className="col col-md-auto">Email</div>
                        <div className="col col-md-auto">Acciones</div>
                </div>
                <div className="row">
                    {admins.map((admin) => (
                        <div className="col-sm-2" key={admin.id}>
                            <div className="col col-md-auto">{admin.nombre}</div>
                            <div>{admin.email}</div>
                            <div className="col col-md-auto">
                                <button className="btn btn-danger btn-sm" onClick={() => DropAdmin(admin.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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