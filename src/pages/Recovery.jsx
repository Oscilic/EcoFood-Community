import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function RecuperarContraseña() {
    const [email, setEmail] = useState("");
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            Swal.fire("Correo enviado", "Revisa tu bandeja para restablecer la contraseña", "success");
        } catch (error) {
            Swal.fire("Error", "No se pudo enviar el correo. Revisa el email ingresado.", "error");
        }
    };
    return (
        <div className="container mt-5">
            <h2>Recuperar Contraseña</h2>
            <form onSubmit={handleReset}>
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-primary">Enviar correo de recuperación</button>
            </form>
        </div>
    );
}