import '../../components/layouts/styles/GeneralStyle.css';
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ValidationModule } from "../../components/ValidationModule";
import Swal from "sweetalert2";

export default function BusinessAdmin() {
    const [business, SetBusiness] = useState([]);
    const [form, SetForm] = useState({
        nombre: "", rut: "", direccion: "", comuna: "", email: "", telefono: ""
    });
    const [editId, SetEditId] = useState(null);
    const empresasRef = collection(db, "empresas");
    const rutRegex = /^[0-9]{1,8}-[0-9Kk]{1}$/;
    const textRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const phoneRegex = /^\+[0-9]{11}/;
    const addressRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/;
    const GetBusiness = async () => {
        const data = await getDocs(empresasRef);
        SetBusiness(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    useEffect(() => {
        GetBusiness();
    });
    const handleChange = e => {
        SetForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.nombre || form.nombre.length < 8 || form.nombre.length > 100 || !textRegex.test(form.nombre)) {
            Swal.fire("Error","Corrige todos los campos con errores antes de proceder.", "error");
            return;
        }
        if (form.rut && !rutRegex.test(form.rut)) {
            Swal.fire("Error", "Corrige todos los campos con errores antes de proceder.", "error");
            return;
        }
        if (form.direccion.length < 10 || form.direccion.length > 200 || !addressRegex.test(form.direccion)) {
            Swal.fire("Error", "Corrige todos los campos con errores antes de proceder.", "error");
            return;
        }
        if (form.comuna.length < 2 || form.comuna.length > 50 || !textRegex.test(form.comuna)) {
            Swal.fire("Error", "Corrige todos los campos con errores antes de proceder.", "error");
            return;
        }
        if (form.email && (form.email.length < 5 || form.email.length > 64 || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))) {
            Swal.fire("Error", "Corrige todos los campos con errores antes de proceder.", "error");
            return;
        }
        if (form.telefono && !phoneRegex.test(form.telefono)) {
            Swal.fire("Error", "Corrige todos los campos con errores antes de proceder.", "error");
            return;
        }
        if (editId) {
            const docRef = doc(db, "empresas", editId);
            await updateDoc(docRef, form);
        } else {
            await addDoc(empresasRef, form);
        }
        SetForm({ nombre: "", rut: "", direccion: "", comuna: "", email: "", telefono: "" });
        SetEditId(null);
        GetBusiness();
    };
    const handleEdit = (empresa) => {
        SetForm(empresa);
        SetEditId(empresa.id);
    };
    const handleDelete = async (id) => {
        if (confirm("¿Seguro que quieres eliminar esta empresa?")) {
            await deleteDoc(doc(db, "empresas", id));
            GetBusiness();
        }
    };
    return (
        <div className="container mt-4">
            <h3 className="my-3">Gestión de Empresas</h3>
            <form onSubmit={handleSubmit}>
                <div className="row justify-content-start">
                    <div className="col-5 mb-1 mx-4">
                            <ValidationModule
                            label="Nombre"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            minLength={8}
                            maxLength={100}
                            regex={textRegex}
                            errorMessage="El nombre debe tener entre 8 y 100 caracteres y solo letras."
                        />
                    </div>
                    <div className="col-5 mb-1 mx-4">
                            <ValidationModule
                            label="RUT"
                            name="rut"
                            value={form.rut}
                            onChange={handleChange}
                            regex={rutRegex}
                            errorMessage="El RUT debe tener el formato XX.XXX.XXX-X o XXXXXXXXX-X."
                        />
                    </div>
                    <div className="col-5 mb-1 mx-4">
                            <ValidationModule
                            label="Dirección"
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            minLength={10}
                            maxLength={200}
                            regex={addressRegex}
                            errorMessage="La dirección debe tener entre 10 y 200 caracteres y solo letras, números o espacios."
                        />
                    </div>
                    <div className="col-5 mb-1 mx-4">
                        <ValidationModule
                            label="Comuna"
                            name="comuna"
                            value={form.comuna}
                            onChange={handleChange}
                            minLength={2}
                            maxLength={50}
                            regex={textRegex}
                            errorMessage="La comuna debe tener entre 2 y 50 caracteres y solo letras."
                        />
                    </div>
                    <div className="col-5 mb-1 mx-4">
                        <ValidationModule
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            minLength={5}
                            maxLength={64}
                            regex="^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$"
                            errorMessage="El email debe tener entre 5 y 64 caracteres y ser un email válido."
                            />
                    </div>
                    <div className="col-5 mb-1 mx-4">
                        <ValidationModule
                            label="Teléfono"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            regex={phoneRegex}
                            errorMessage="El teléfono debe tener el formato +569XXXXXXXXX."
                        />
                    </div>
                </div>
                <button className="btn btn-primary mx-3 my-2" type="submit">{editId ? "Actualizar" : "Agregar"} Empresa</button>
                {editId && 
                    <button className="btn btn-danger mx-3 my-2" type="button" onClick={() => {SetForm({ nombre: "", rut: "", direccion: "", comuna: "", email: "", telefono: "" });SetEditId(null);}}>
                        Cancelar
                    </button>}
            </form>
            <div className="container text-center align-content-center">
                <hr/>
                {business.map(emp => (
                <div className="row align-items-center" key={emp.id}>
                    <p className="col-3">Nombre: {emp.nombre}</p>
                    <p className="col-2">RUT: {emp.rut}</p>
                    <p className="col-1">Comuna: {emp.comuna}</p>
                    <p className="col-2">Teléfono: {emp.telefono}</p>
                    <div className="row col-4 justify-content-center column-gap-2">
                        <button className="btn btn-primary col-4" onClick={() => handleEdit(emp)}>Editar</button>
                        <button className="btn btn-danger col-4" onClick={() => handleDelete(emp.id)}>Eliminar</button>
                    </div>
                </div>
                ))}
                <hr/>
            </div>
        </div>
    );
}