import '../../components/layouts/styles/GeneralStyle.css';
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, runTransaction, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

//const searchRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/;

export default function BusinessRequests() {
    const { user } = useAuth();
    const [requests, SetRequests] = useState([]);
    const navigate = useNavigate();
    // Si en el futuro se agregan filtros o búsqueda, usar este patrón:
    // const [search, SetSearch] = useState("");
    // const [searchError, SetSearchError] = useState("");
    // const handleSearchChange = (e) => {
    //     const value = e.target.value;
    //     if (!searchRegex.test(value)) {
    //         SetSearchError("La búsqueda solo puede contener letras, números y espacios.");
    //     } else {
    //         SetSearchError("");
    //     }
    //     SetSearch(value);
    // };
    const LoadRequests = async () => {
        if (!user) return;
        const ordersRef = collection(db, "pedidos");
        const q = query(ordersRef, where("empresaId", "==", user.uid));
        const ordersSnap = await getDocs(q);
        const detailedRequests = await Promise.all(ordersSnap.docs.map(async (pedidoDoc) => {
            const orderData = pedidoDoc.data();
            let userName = 'Desconocido';
            if (orderData.clienteId) {
                const userRef = doc(db, "usuarios", orderData.clienteId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    userName = userSnap.data().nombre;
                }
            }
            return {
                id: pedidoDoc.id,
                ...orderData,
                clienteNombre: userName
            };
        }));
        
        SetRequests(detailedRequests);
    };
    useEffect(() => {
        if (user?.uid) {
            LoadRequests();
        }
    },);
    const UpdateState = async (solicitud, nuevoEstado) => {
        const orderRef = doc(db, "pedidos", solicitud.id);
        
        if (nuevoEstado === "rechazado") {
            await updateDoc(orderRef, { estado: "rechazado" });
            Swal.fire("Rechazado", "La solicitud ha sido rechazada.", "success");
            LoadRequests();
            return;
        }
        if (nuevoEstado === "confirmado") {
            const productRef = doc(db, "productos", solicitud.productoId);
            try {
                await runTransaction(db, async (transaction) => {
                    const productDoc = await transaction.get(productRef);
                    if (!productDoc.exists()) {
                        throw new Error("El producto asociado a este pedido ya no existe.");
                    }
                    const currentStock = productDoc.data().cantidad;
                    if (currentStock < solicitud.cantidad) {
                        throw new Error(`No hay suficiente stock. Disponible: ${currentStock}, Solicitado: ${solicitud.cantidad}.`);
                    }
                    const newStock = currentStock - solicitud.cantidad;
                    transaction.update(productRef, { cantidad: newStock });
                    transaction.update(orderRef, { estado: "confirmado" });
                });
                Swal.fire("¡Confirmado!", "La solicitud ha sido aprobada y el stock ha sido actualizado.", "success");
            } catch (error) {
                console.error("Error en la transacción: ", error);
                Swal.fire("Error", `No se pudo confirmar la solicitud: ${error.message}`, "error");
            }
            LoadRequests();
        }
    };
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Solicitudes de Productos</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
            </div>
            {requests.length === 0 ? (
                <p>No hay solicitudes pendientes.</p>
            ) : (
                <div className="row">
                    {requests.map(s => (
                        <div className="col-md-6 mb-3" key={s.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{s.productoNombre}</h5>
                                    <p className="card-text">
                                        Cliente: <strong>{s.clienteNombre}</strong><br />
                                        Cantidad: {s.cantidad}<br />
                                        Estado: <span className={`fw-bold text-${s.estado === 'pendiente' ? 'warning' : s.estado === 'confirmado' ? 'success' : 'danger'}`}>{s.estado}</span>
                                    </p>
                                    {s.estado === "pendiente" && (
                                        <>
                                            <button className="btn btn-success me-2" onClick={() => UpdateState(s, "confirmado")}>
                                                Confirmar
                                            </button>
                                            <button className="btn btn-danger" onClick={() => UpdateState(s, "rechazado")}>
                                                Rechazar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}