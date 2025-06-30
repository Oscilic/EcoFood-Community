import { useEffect, useState } from "react";
import { GetClients, AddClient, UpdateClient, DeleteClient } from "../../services/clientFirebase";
import Swal from "sweetalert2";

export default function UsersAdmin() {
    const [clients, SetClients] = useState([]);
    const [activeClient, SetActiveClient] = useState(null);
    const [showModal, SetShowModal] = useState(false);
    const [formData, SetFormData] = useState({nombre: "", email:"", comuna:""});

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
            <h3>Clientes Registrados</h3>
            <button className="btn btn-primary" onClick={() => { SetActiveClient(null);SetShowModal(true); }}>Nuevo Cliente</button>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Comuna</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((c) => (
                        <tr key={c.id}>
                            <td>{c.nombre}</td>
                            <td>{c.email}</td>
                            <td>{c.comuna}</td>
                            <td>
                                <button className="btn btn-warning btn-sm" onClick={() => { SetActiveClient(c); SetFormData(c); SetShowModal(true); }}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => Delete(c.id)}>Eliminar</button>
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
                                <input className="form-control mb-2" placeholder="Nombre" value={formData.nombre}
                                onChange={(e) => SetFormData({ ...formData, nombre: e.target.value })} />
                                <input className="form-control mb-2" placeholder="Email" value={formData.email}
                                onChange={(e) => SetFormData({ ...formData, email: e.target.value })} />
                                <input className="form-control mb-2" placeholder="Comuna" value={formData.comuna}
                                onChange={(e) => SetFormData({ ...formData, comuna: e.target.value })} />
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