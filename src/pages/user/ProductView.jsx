import { useEffect, useState } from "react";
import { GetProducts } from "../../services/clientService";
import ProductCard from "../../components/ProductCard";
import { useAuth } from "../../context/AuthContext";
import { OrderProduct } from "../../services/orderService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProductView() {
    const [productos, SetProducts] = useState([]);
    const [filter, SetFilter] = useState({ nombre: "", estado: "todos", orden: "az", cantidad: 10 });
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        LoadProducts();
    },);
    const LoadProducts = async () => {
        const data = await GetProducts(filter);
        SetProducts(data);
    };
    const handleOrder = async (product) => {
        console.log("Producto al solicitar:", product);
        const confirmacion = await Swal.fire({
            title: "¿Solicitar este producto?",
            text: product.nombre,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, solicitar",
            cancelButtonText: "Cancelar",
        });
        if (confirmacion.isConfirmed) {
            try {
                await OrderProduct(user.uid, product);
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
                {productos.length >= 1 ? (
                    productos.map(product => (
                        <div className="col-md-4 mb-3" key={product.id}>
                            <ProductCard
                                product={product}
                                reload={LoadProducts}
                                onOrder={() => handleOrder(product)}
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