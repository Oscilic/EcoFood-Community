import { db } from "./firebase";
import {collection,query,where,getDocs,addDoc,doc,deleteDoc,Timestamp} from "firebase/firestore";
export const GetUserOrders = async (clienteId) => {
    const ref = collection(db, "pedidos");
    const q = query(ref, where("clienteId", "==", clienteId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const OrderProduct = async (clienteId, producto) => {
    const ref = collection(db, "pedidos");
    const q = query(ref, where("clienteId", "==", clienteId), where("productoId", "==", producto.id));
    const snap = await getDocs(q);
    if (!snap.empty) {
        throw new Error("Ya se solicitó este producto anteriormente.");
    }
    const newOrder = {
        clienteId,
        productoId: producto.id,
        productoNombre: producto.nombre,
        empresaId: producto.empresaId,
        empresaNombre: producto.empresaNombre,
        fecha: Timestamp.now(),
        estado: "pendiente"
    };
    await addDoc(ref, newOrder);
};
export const CancelOrder = async (pedidoId) => {
    const ref = doc(db, "pedidos", pedidoId);
    await deleteDoc(ref);
};
export const CreateOrder = async (pedido) => {
    const ref = collection(db, "pedidos");
    await addDoc(ref, {
        ...pedido,
        fecha: pedido.fecha || Timestamp.now(),
        estado: pedido.estado || "pendiente",
    });
};