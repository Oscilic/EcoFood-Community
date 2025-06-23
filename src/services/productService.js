import { db } from "/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
const productosRef = collection(db, "productos");
export async function CreateProduct(producto) {
    return await addDoc(productosRef, producto);
}
export async function UpdateProduct(id, data) {
    return await updateDoc(doc(db, "productos", id), data);
}
export async function DeleteProduct(id) {
    return await deleteDoc(doc(db, "productos", id));
}
export async function GetBusinessProduct(empresaId) {
    const q = query(productosRef, where("empresaId", "==", empresaId));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}