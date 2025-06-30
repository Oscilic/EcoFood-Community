import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { SaveUserData } from "../services/userService";
import { sendEmailVerification } from "firebase/auth";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("cliente");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(cred.user);
            await SaveUserData(cred.user.uid, { nombre, tipo, email });
            Swal.fire("Registro exitoso", "Usuario creado correctamente, verifica tu correo elctrónico para iniciar sesión.", "success");
            navigate("/login");
        } catch (error) {
            Swal.fire("Error", "No se pudo completar el registro, inténtalo de nuevo más tarde.", "error");
            console.error("Error al registrar: ", error);
        }
    }
    return (
        <div className="container mt-5">
            <h2>Registro</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                <label className="form-label">Tipo de usuario</label>
                <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="cliente">Cliente</option>
                    <option value="empresa">Empresa</option>
                    <option value="admin">Administrador</option>
                </select>
                </div>
                <button type="submit" className="btn btn-success">Registrar</button>
            </form>
        </div>
    );
}