import '../../components/layouts/styles/GeneralStyle.css';
import { useEffect, useState } from "react";
import { GetClients, AddClient, UpdateClient, DeleteClient } from "../../services/clientFirebase";
import Swal from "sweetalert2";
import { ValidationModule } from "../../components/ValidationModule";

export default function UsersAdmin() {
    const [clients, SetClients] = useState([]);
    const [activeClient, SetActiveClient] = useState(null);
    const [showModal, SetShowModal] = useState(false);
    const [formData, SetFormData] = useState({nombre: "", email:"", password:""});

    const LoadClients = async() => {
        const data = await GetClients();
        SetClients(data);
    };
    const Save = async() => {
        if(activeClient) {
            await UpdateClient(activeClient.id, formData);
        } else {
            await AddClient(formData);
        }
        SetShowModal(false)
        LoadClients()
    };
    const Delete = async(id) => {
        const result = await Swal.fire({
            title:"¿Desea eliminar este cliente?",
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"Sí"});
        if (result.isConfirmed) {
            await DeleteClient(id);
            LoadClients()
        }
    };
    useEffect(() =>{
        LoadClients();
    },[]);
    return (
        <div className="container mt-4">
            <h3 className="my-3">Clientes Registrados</h3>
            <button className="btn btn-primary my-2" onClick={() => { SetActiveClient(null);SetShowModal(true); }}>Nuevo Cliente</button>
            <table className="table mt-3">
                <thead className="container">
                    <tr className="justify-items-center">
                        <th className="col-4">Nombre</th>
                        <th className="col-3">Email</th>
                        <th className="col-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((c) => (
                        <tr className="align-middle" key={c.id}>
                            <td className="my-1">{c.nombre}</td>
                            <td className="my-1">{c.email}</td>
                            <td className="row justify-content-center column-gap-2 my-1">
                                <button className="btn btn-warning btn-sm col-4" onClick={() => { SetActiveClient(c); SetFormData(c); SetShowModal(true); }}>Editar</button>
                                <button className="btn btn-danger btn-sm col-4" onClick={() => Delete(c.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header"><h5 className="modal-title">{activeClient ? "Editar cliente" : "Nuevo cliente"}</h5></div>
                            <div className="modal-body">
                                <div className="container mx-auto">
                                    <ValidationModule
                                        label="Nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => SetFormData({ ...formData, nombre: e.target.value })}
                                        minLength={2}
                                        maxLength={100}
                                        regex= "^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                                        errorMessage="El nombre debe tener entre 2 y 100 caracteres."
                                    />
                                    <ValidationModule
                                        label="Correo electrónico"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => SetFormData({ ...formData, email: e.target.value })}
                                        minLength={5}
                                        maxLength={64}
                                        regex= "^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$"
                                        errorMessage="El correo electrónico debe tener entre 5 y 64 caracteres y ser un email válido."
                                    />
                                    <ValidationModule
                                        label="Contraseña"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => SetFormData({ ...formData, password: e.target.value })}
                                        minLength={8}
                                        maxLength={100}
                                        regex= "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
                                        type="password"
                                        errorMessage="La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
                                    />
                                </div>
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