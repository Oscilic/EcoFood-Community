import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { CreateOrder } from "../services/orderService";

export default function ProductCard({ product, reload }) {
    const { user } = useAuth();
    const [cantidad, setCantidad] = useState(1);
    const order = async () => {
        if (!product.cantidad || product.cantidad < 1) {
            Swal.fire("Sin stock", "No hay stock disponible para este producto.", "info");
            return;
        }
        if (cantidad < 1 || cantidad > product.cantidad) {
            Swal.fire("Cantidad inválida", "Selecciona una cantidad válida.", "warning");
            return;
        }
        const confirm = await Swal.fire({
            title: `¿Solicitar "${product.nombre}"?`,
            text: `Confirmas solicitar ${cantidad} unidad(es) a ${product.empresaNombre}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, solicitar"
        });
        if (confirm.isConfirmed) {
            try {
                await CreateOrder({
                    productoId: product.id,
                    productoNombre: product.nombre,
                    empresaId: product.empresaId,
                    empresaNombre: product.empresaNombre,
                    clienteId: user.uid,
                    cantidad: cantidad,
                    estado: "pendiente",
                    fecha: new Date()
                });
                Swal.fire("Solicitud enviada", "", "success");
                if (reload) reload();
            } catch (error) {
                console.error("Error al solicitar:", error);
                Swal.fire("Error", "No se pudo realizar la solicitud", "error");
            }
        }
    };
    const handleChange = (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > product.cantidad) value = product.cantidad;
        setCantidad(value);
    };
    return (
        <div className="card h-100">
            <div className="card-body">
                <h5 className="card-title">{product.nombre}</h5>
                <p className="card-text">{product.descripcion}</p>
                <p className="card-text">
                    Empresa: <strong>{product.empresaNombre || "Desconocida"}</strong>
                </p>
                <p className="card-text">
                    Precio: <strong>${product.precio === 0 ? "Gratuito" : product.precio}</strong>
                </p>
                <p className="card-text">
                    Stock: <strong>{product.cantidad}</strong>
                </p>
                <div className="d-flex align-items-center mb-2">
                    <input
                        type="number"
                        min={1}
                        max={product.cantidad}
                        value={cantidad}
                        onChange={handleChange}
                        className="form-control me-2"
                        style={{ width: 80 }}
                        disabled={product.cantidad < 1}
                    />
                    <button
                        className="btn btn-success"
                        disabled={product.cantidad < 1}
                        onClick={order}
                    >
                        Solicitar
                    </button>
                </div>
                {product.cantidad < 1 && (
                    <span className="text-danger">Fuera de stock</span>
                )}
            </div>
        </div>
    );
}