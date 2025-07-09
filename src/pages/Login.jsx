import '../components/layouts/styles/GeneralStyle.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { getDoc, doc} from 'firebase/firestore';
import Swal from "sweetalert2";
import { ValidationModule } from "../components/ValidationModule";
//Arenque.12
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            if (data.tipo === "admin" || data.tipo === "superadmin") {
                navigate("/admin/dashboard");
            } else if (data.tipo === "cliente") {
                navigate("/client/home");
            } else if (data.tipo === "empresa") {
                navigate("/business/profile");
            } else {
                Swal.fire("Error", "Ocurrió un problema al iniciar sesión. Por favor, inténtalo de nuevo.","error");
            }
            } else {
                Swal.fire("Error", "Usuario no encontrado","error");
            }
        } catch {
            Swal.fire("Error", "Credenciales inválidas o error de conexión.","error");
        }
    };
    return (
    <div className="container mt-4">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
            <div className="px-3 mb-3">
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
                    maxLength={96}
                    errorMessage="Contraseña inválida"
                />
            </div>
            <button className="btn btn-success mt-3">Iniciar sesión</button>
        </form>
        <div className="login-links mt-5" style={{ textAlign: "center" }}>
            <a href="/register" className="me-3">¿No tienes una cuenta? Regístrate</a>
            <a href="/recovery">¿Olvidaste tu contraseña?</a>
        </div>
    </div>
    );
}
export default Login;