import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { getDoc, doc } from 'firebase/firestore';
import Swal from "sweetalert2";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleLogin = async e => {
        e.preventDefault();
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            if (!userCred.user.emailVerified) {
                Swal.fire("Verificación requerida", "Verifica tu correo antes de poder utilzar EcoFood.","warning");
                return;
            }
            const ref = doc(db, "usuarios", userCred.user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
            const data = snap.data();
            if (data.tipo === "admin") {
                navigate("/admin/dashboard");
            } else if (data.tipo === "cliente") {
                navigate("/client/home");
            } else if (data.tipo === "empresa") {
                navigate("/business/profile");
            } else {
                setError("Error al inicar sesión. Por favor, inténtalo de nuevo.");
            }
            } else {
            setError("Usuario no encontrado.");
            }
        } catch (err) {
            console.error(err);
            setError("Credenciales inválidas o error de conexión.");
        }
    };
    return (
    <div className="container mt-4">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
            <input className="form-control mb-2" type="email" placeholder="Correo" onChange={e => setEmail(e.target.value)} required/>
            <input className="form-control mb-2" type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} required/>
            <button className="btn btn-success">Ingresar</button>
        </form>
        <p className="text-danger mt-3">{error}</p>
        <div className="login-links mt-3" style={{ textAlign: "center" }}>
            <a href="/register" className="me-3">¿No tienes cuenta? Regístrate</a>
            <a href="/recovery">¿Olvidaste tu contraseña?</a>
        </div>
    </div>
    );
}
export default Login;