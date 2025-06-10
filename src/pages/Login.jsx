import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await setPersistence(auth, browserLocalPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            Swal.fire("Bienvenido", "Has iniciado sesión correctamente", "success");
            navigate("/home");
        } catch (error) {
            Swal.fire("Error", "Credenciales incorrectas o fallo de red", "error");
        }
    };
    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                <p>¿Olvidaste tu contraseña?<Link to="/recuperar">Recupérala aquí</Link></p>
            </form>
        </div>
    );
}
const handleLogin = async (e) => {
    e.preventDefault();
    try {
        await setPersistence(auth, browserLocalPersistence);
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (!cred.user.emailVerified) {
            Swal.fire("Verificación requerida", "Debes verificar tu correo antes de ingresar.", "warning");
            return;
        }
        const datos = await getUserData(cred.user.uid);
        console.log("Bienvenido", datos.nombre, "Tipo:", datos.tipo);
        navigate("/home");
    } catch (error) {
        Swal.fire("Error", "Credenciales incorrectas", "error");
    }
};