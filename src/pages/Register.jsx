import '../components/layouts/styles/GeneralStyle.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { SaveUserData } from "../services/userService";
import { sendEmailVerification } from "firebase/auth";
import { ValidationModule } from "../components/ValidationModule";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (
            !nombre || nombre.length < 2 || nombre.length > 100 || !nombreRegex.test(nombre) ||
            !email || email.length < 5 || email.length > 64 || !emailRegex.test(email) ||
            !password || password.length < 8 || password.length > 100 || !passwordRegex.test(password)
        ) {
            Swal.fire("Error", "Por favor corrige los campos marcados antes de continuar.", "error");
            return;
        }
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(cred.user);
            await SaveUserData(cred.user.uid, { nombre, tipo : "cliente", email });
            Swal.fire("Registro exitoso", "Usuario creado correctamente, verifica tu correo elctrónico para iniciar sesión.", "success");
            navigate("/login");
        } catch (error) {
            Swal.fire("Error", "No se pudo completar el registro, verifica los datos ingresados e inténtalo de nuevo.", "error");
            console.error("Error al registrar: ", error);
        }
    }
    return (
        <div className="container mt-5">
            <h2>Registro</h2>
            <form onSubmit={handleRegister}>
                <div className="px-3 mb-3">
                    <ValidationModule
                            label="Nombre completo"
                            name="nombre"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            type="text"
                            required={true}
                            minLength={2}
                            maxLength={100}
                            regex="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                            errorMessage="El nombre debe contener solo letras y espacios"
                        />
                    <ValidationModule
                            label="Correo electrónico"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            required={true}
                            minLength={5}
                            maxLength={64}
                            regex="^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$"
                            errorMessage="Correo inválido"
                        />
                    <ValidationModule
                            label="Contraseña"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                            required={true}
                            minLength={8}
                            maxLength={100}
                            regex="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
                            errorMessage="La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
                        />
                </div>
                <button type="submit" className="btn btn-success">Registrarse</button>
            </form>
        </div>
    );
}