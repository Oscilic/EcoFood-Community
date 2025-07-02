import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function BusinessAdmin() {
    const [business, SetBusiness] = useState([]);
    const [form, SetForm] = useState({
        nombre: "", rut: "", direccion: "", comuna: "", email: "", telefono: ""
    });
    const [editId, SetEditId] = useState(null);
    const empresasRef = collection(db, "empresas");
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
        <div className="empresas-admin">
            <h2>Gestión de Empresas</h2>
            <form onSubmit={handleSubmit} className="empresa-form">
                {Object.keys(form).map(key => (
                <input
                    key={key}
                    name={key}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={form[key]}
                    onChange={handleChange}
                    required
                />
                ))}
                <button type="submit">{editId ? "Actualizar" : "Agregar"} Empresa</button>
            </form>
            <div className="empresa-lista">
                {business.map(emp => (
                <div key={emp.id} className="empresa-card">
                    <p><strong>{emp.nombre}</strong></p>
                    <p>RUT: {emp.rut}</p>
                    <p>Comuna: {emp.comuna}</p>
                    <p>Teléfono: {emp.telefono}</p>
                    <div className="empresa-acciones">
                        <button onClick={() => handleEdit(emp)}>Editar</button>
                        <button onClick={() => handleDelete(emp.id)}>Eliminar</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}