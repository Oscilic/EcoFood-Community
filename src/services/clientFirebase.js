import { db } from "./firebase";
import { collection, query, where, getDocs,addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export const GetClients = async() => {
    const q = query(collection(db, "usuarios"), where("tipo","==","cliente"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
};
export const AddClient = async(clientData) => {
    return await addDoc(collection(db, "usuarios"), {
        ...clientData, tipo: "cliente"});
};
export const UpdateClient = async(id, clientData) => {
    const ref = doc(db, "usuarios", id);
    return await updateDoc(ref, clientData);
};
export const DeleteClient = async(id) => {
    const ref = doc(db, "usuarios", id);
    return await deleteDoc(ref);
};