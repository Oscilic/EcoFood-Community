import { doc, getDoc, setDoc, query, collection, deleteDoc, where  } from "firebase/firestore";
import { db } from "./firebase"

export const GetUserData = async (uid) => {
    try {
        const ref = doc(db, "usuarios", uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
            return snapshot.data();
        } else {
            throw new Error("Usuario no registrado");
        }
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
    throw error;
    }
};
export const SaveUserData = async (uid, data) => {
    try {
        await setDoc(doc(db, "usuarios", uid), data);
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        throw error;
    }
};
export const GetAdmins = async () => {
    const q = query(collection(db, "usuarios"), where("tipo", "==", "admin"));
    const snapshot = await getDoc(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const DeleteAdmin = async (id) => {
    const ref = doc(db, "usuarios", id);
    await deleteDoc(ref);
};