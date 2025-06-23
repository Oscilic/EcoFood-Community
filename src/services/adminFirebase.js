import { db, secondaryAuth } from "./firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export const adminRegister = async (data) => {
    try {
        const cred = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
        await sendEmailVerification(cred.user);
        await setDoc(doc(db, "usuarios", cred.user.uid), {
            nombre: data.nombre || "",
            tipo: "admin",
            email: data.email || ""
        });
        await secondaryAuth.signOut();
        return cred;
    } catch (error) {
        console.error("Error al registrar administrador:", error);
        throw error;
    }
};