import '../../components/layouts/styles/GeneralStyle.css';
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";
import { ValidationModule } from "../../components/ValidationModule";
export default function BusinessProfile() {
    const { user } = useAuth();
    const [business, SetBusiness] = useState(null);
    const [editing, SetEditing] = useState(false);
    const [originalData, SetOriginalData] = useState(null);
    const rutRegex = /^[0-9]{1,8}-[0-9Kk]{1}$/;
    const textRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const phoneRegex = /^\+[0-9]{11}/;
    const addressRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/;
    useEffect(() => {
        if (user) {
            const GetBusiness = async () => {
                const ref = doc(db, "usuarios", user.uid);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    SetBusiness(snap.data());
                    SetOriginalData(snap.data());
                }
            };
            GetBusiness();
        }
    }, [user]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        SetBusiness({ ...business, [name]: value });
    };
    const SaveChanges = async (e) => {
        e.preventDefault();
        if (!business.nombre || business.nombre.length < 8 || business.nombre.length > 100 || !textRegex.test(business.nombre)) {
            Swal.fire("Error", "Corrige todos los campos modificados antes de guardar los cambios.", "error");
            return;}
        if (business.rut && !rutRegex.test(business.rut)) {
            Swal.fire("Error", "Corrige todos los campos modificados antes de guardar los cambios.", "error");
            return;}
        if (business.direccion.length < 10 || business.direccion.length > 200 || !textRegex.test(business.direccion)) {
            Swal.fire("Error", "Corrige todos los campos modificados antes de guardar los cambios.", "error");
            return;}
        if (business.comuna.length < 6 || business.comuna.length > 30 || !textRegex.test(business.comuna)) {
            Swal.fire("Error", "Corrige todos los campos modificados antes de guardar los cambios.", "error");
            return;}
        if (business.telefono && !phoneRegex.test(business.telefono)) {
            Swal.fire("Error", "Corrige todos los campos modificados antes de guardar los cambios.", "error");
            return;}
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
    if (!business) {
        return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>)
    }
    return (
        <div className="container">
            <h2>Perfil Empresarial</h2>
            <form onSubmit={SaveChanges}>
                <div className="row justify-content-start">
                    <div className="col-5 mb-1 mx-4">
                        <ValidationModule
                            label ="Nombre de la empresa"
                            name={"nombre"}
                            value={business.nombre || ""}
                            onChange={handleChange}
                            type="text"
                            required = {false}
                            minLength={8}
                            maxLength={100}
                            regex={textRegex}
                            errorMessage="El nombre de la empresa debe contener solo letras y espacios, y tener entre 8 y 100 caracteres."
                            disabled={!editing}
                            />
                    </div>
                    <div className="col-5 mb-1 mx-4">
                        <div className="row justify-content-between">
                            <label className="block font-medium mb-1 mt-3">Email:</label>
                            <input className="border p-2 w-full form-control rounded" value={business.email || ""} disabled/>
                        </div>
                    </div>
                    <div className="col-5 mb-1 mx-4">
                        <ValidationModule
                            label="Rut"
                            name="rut"
                            value={business.rut || ""}
                            onChange={handleChange}
                            type="text"
                            required={false}
                            minLength={8}
                            maxLength={12}
                            regex={rutRegex}
                            errorMessage="El RUT debe tener el formato XX.XXX.XXX-X o XXXXXXXXX-X"
                            disabled={!editing}
                            />
                    </div>
                    <div className="col-5 mb-1 mx-4">
                        <ValidationModule
                            label="Dirección"
                            name="direccion"
                            value={business.direccion || ""}
                            onChange={handleChange}
                            type="text"
                            required={false}
                            minLength={10}
                            maxLength={200}
                            regex={addressRegex}
                            errorMessage="La dirección actual no es válida. Debe tener al menos 10 caracteres y contener solo letras y espacios."
                            disabled={!editing}
                            />
                    </div>
                    <div className="col-5 mb-1 mx-4">
                        <ValidationModule
                            label="Comuna"
                            name="comuna"
                            value={business.comuna || ""}
                            onChange={handleChange}
                            type="text"
                            required={false}
                            minLength={6}
                            maxLength={30}
                            regex={textRegex}
                            errorMessage="La comuna actual no es válida. Debe tener al menos 6 caracteres y contener solo letras y espacios."
                            disabled={!editing}
                            />
                    </div>
                    <div className="col-5 mb-1 mx-4">
                        <ValidationModule
                            label="Número telefónico"
                            name="telefono"
                            value={business.telefono || ""}
                            onChange={handleChange}
                            type="text"
                            required={false}
                            minLength={9}
                            maxLength={12}
                            regex={phoneRegex}
                            errorMessage="Ingresa un número telefónico válido con el formato +569XXXXXXXX."
                            disabled={!editing}
                            />
                    </div>
                </div>
                {!editing ? (
                    <div className="row justify-content-center mt-4">
                        <button className="col-md-2 btn btn-primary ms-2 mt-4" onClick={() => SetEditing(true)} type="button">
                            Editar Perfil
                        </button>
                    </div>
                ) : (
                    <div className="row justify-content-evenly mt-4">
                        <button className="col-2 btn btn-success mx-1" type="submit" >
                            Guardar Cambios
                        </button>
                        <button className="col-2 btn btn-secondary mx-1" onClick={() => {SetBusiness(originalData);SetEditing(false);}} type="button">
                            Cancelar
                        </button>
                    </div>)}
            </form>
        </div>
    );
}