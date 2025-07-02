import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const GetProducts = async (filters) => {
    const ref = collection(db, "productos");
    const snapshot = await getDocs(ref);
    let products = [];
    for (let docSnap of snapshot.docs) {
        const prod = docSnap.data();
        prod.id = docSnap.id;
        if (prod.estado !== "disponible") continue;
        prod.precio = parseFloat(prod.precio);
        prod.cantidad = parseInt(prod.cantidad);
        if (filters.nombre && !prod.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) {
            continue;
        }
        if (filters.estado === "gratuito" && prod.precio > 0) continue;
        if (filters.estado === "pago" && prod.precio === 0) continue;
        if (["porVencer", "vencido", "todos"].includes(filters.estado)) {
            const hoy = new Date();
            const vencimiento = new Date(prod.vencimiento);
            const dias = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
            if (filters.estado === "porVencer" && (dias > 3 || dias < 0)) continue;
            if (filters.estado === "vencido" && dias >= 0) continue;
            if (prod.empresaId) {
                const empresaRef = doc(db, "usuarios", prod.empresaId);
                const empresaSnap = await getDoc(empresaRef);
                prod.empresaNombre = empresaSnap.exists() ? empresaSnap.data().nombre : "Desconocida";
            } else {
                prod.empresaNombre = "Sin empresa";
            }
                products.push(prod);
            }
        if (filters.orden === "az") {
            products.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else if (filters.orden === "za") {
            products.sort((a, b) => b.nombre.localeCompare(a.nombre));
        } else if (filters.orden === "precioAsc") {
            products.sort((a, b) => a.precio - b.precio);
        } else if (filters.orden === "precioDesc") {
            products.sort((a, b) => b.precio - a.precio);
        }
    return products.slice(0, filters.cantidad || 10);
    };
}