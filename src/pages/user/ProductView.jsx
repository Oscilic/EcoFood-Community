import { useEffect, useState } from "react";
import { GetProducts } from "../../services/clientService";
import ProductoCard from "../../components/ProductoCard";
import { useAuth } from "../../context/AuthContext";
import { OrderProduct } from "../../services/orderService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ProductView() {
    const [products, SetProducts] = useState([]);
    const [filter, SetFilter] = useState({ nombre: "", estado: "todos", orden: "az", cantidad: 10 });
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        LoadProducts();
    }, [filter]);
    const LoadProducts = async () => {
        const data = await GetProducts(filter);
        SetProducts(data);
    };
    const handleOrder = async (producto) => {
        console.log("Producto al solicitar:", producto);
        const confirmacion = await Swal.fire({
            title: "¿Solicitar este producto?",
            text: producto.nombre,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, solicitar",
            cancelButtonText: "Cancelar",
        });
        if (confirmacion.isConfirmed) {
            try {
                await OrderProduct(user.uid, producto);
                Swal.fire("Solicitud enviada", "", "success");
                LoadProducts();
            } catch (error) {
                Swal.fire("Error al solicitar", error.message, "error");
            }
        }
    };
    return (
        <div className="container mt-4">
            <h2>Productos Disponibles</h2>
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        className="form-control"
                        placeholder="Buscar por nombre"
                        onChange={e => SetFilter({ ...filter, nombre: e.target.value })}
                    />
                </div>
                <div className="col-md-3">
                    <select className="form-select" onChange={e => SetFilter({ ...filter, estado: e.target.value })}>
                        <option value="todos">Todos</option>
                        <option value="disponible">Disponibles</option>
                        <option value="porVencer">Por vencer</option>
                        <option value="vencido">Vencidos</option>
                        <option value="gratuito">Gratuitos</option>
                        <option value="pago">De Pago</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select className="form-select" onChange={e => SetFilter({ ...filter, orden: e.target.value })}>
                        <option value="az">Nombre (A-Z)</option>
                        <option value="za">Nombre (Z-A)</option>
                        <option value="precioAsc">Precio Ascendente</option>
                        <option value="precioDesc">Precio Descendente</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <select className="form-select" onChange={e => SetFilter({ ...filter, cantidad: parseInt(e.target.value) })}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>
            <div className="row">
                {products.length > 0 ? (
                    products.map(producto => (
                        <div className="col-md-4 mb-3" key={producto.id}>
                            <ProductoCard
                                producto={producto}
                                recargar={LoadProducts}
                                onSolicitar={() => handleOrder(producto)}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No hay productos disponibles.</p>
                )}
            </div>
            <div className="mt-4">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Volver
                </button>
            </div>
        </div>
    );
}