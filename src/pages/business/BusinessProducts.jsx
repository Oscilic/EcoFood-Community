import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    GetBusinessProduct,
} from "../../services/productService";
import ProductoModal from "../../components/empresa/ProductoModal";
import ProductoCard from "../../components/empresa/ProductoCard";

export default function BusinessProducts() {
    const { user } = useAuth();
    const [products, SetProduct] = useState([]);
    const [showModal, SetModalShow] = useState(false);
    const [productEdit, SetProductEdit] = useState(null);
    const [search, SetSearch] = useState("");
    const [statusFilter, SetStatusFilter] = useState("todos");
    const [order, SetOrderBy] = useState("nombre-asc");
    const [perPage, SetAmountPerPage] = useState(5);
    const [currentPage, SetCurrentPage] = useState(1);
    const navigate = useNavigate();
    const LoadProducts = async () => {
        if (!user) return;
        const data = await GetBusinessProduct(user.uid);
        SetProduct(data);
    };
    useEffect(() => {
        LoadProducts();
    }, [user]);
    const SaveProduct = async (producto) => {
        if (productEdit) {
            await UpdateProduct(productEdit.id, producto);
        } else {
            await CreateProduct({ ...producto, empresaId: user.uid, estado: "disponible" });
        }
        SetModalShow(false);
        SetProductEdit(null);
        LoadProducts();
    };
    const Delete = async (id) => {
        await DeleteProduct(id);
        LoadProducts();
    };
    const FilterAndOrder = () => {
        let lista = [...products];
        const hoy = new Date();
        if (statusFilter !== "todos") {
            lista = lista.filter((p) => {
                const d = new Date(p.vencimiento);
                const dias = Math.ceil((d - hoy) / (1000 * 60 * 60 * 24));
                if (statusFilter === "disponible") return dias > 3;
                if (statusFilter === "porVencer") return dias <= 3 && dias >= 0;
                if (statusFilter === "vencido") return dias < 0;
                return true;
            });
        }
        if (search) {
            lista = lista.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()));
        }
        if (order === "nombre-asc") lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
        if (order === "nombre-desc") lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
        if (order === "precio-asc") lista.sort((a, b) => a.precio - b.precio);
        if (order === "precio-desc") lista.sort((a, b) => b.precio - a.precio);
        return lista;
    };
    const productosFiltrados = FilterAndOrder();
    const totalPaginas = Math.ceil(productosFiltrados.length / perPage);
    const inicio = (currentPage - 1) * perPage;
    const productosPagina = productosFiltrados.slice(inicio, inicio + perPage);
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Productos</h2>
                <div>
                    <button
                        className="btn btn-outline-secondary me-2"
                        onClick={() => navigate(-1)}
                    >
                        ← Volver
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => SetModalShow(true)}
                    >
                        + Producto
                    </button>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-3">
                    <input className="form-control" placeholder="Buscar" value={search} onChange={e => SetSearch(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={statusFilter} onChange={e => SetStatusFilter(e.target.value)}>
                        <option value="todos">Todos</option>
                        <option value="disponible">Disponibles</option>
                        <option value="porVencer">Por vencer</option>
                        <option value="vencido">Vencidos</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={order} onChange={e => SetOrderBy(e.target.value)}>
                        <option value="nombre-asc">Nombre A-Z</option>
                        <option value="nombre-desc">Nombre Z-A</option>
                        <option value="precio-asc">Precio ascendente</option>
                        <option value="precio-desc">Precio descendente</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={perPage} onChange={e => {
                        SetAmountPerPage(Number(e.target.value));
                        SetCurrentPage(1);
                    }}>
                        <option value={5}>5 por página</option>
                        <option value={10}>10 por página</option>
                        <option value={20}>20 por página</option>
                    </select>
                </div>
            </div>
            {productosPagina.map((prod) => (
                <ProductoCard key={prod.id} producto={prod} onEdit={(p) => {
                    SetProductEdit(p);
                    SetModalShow(true);
                }} onDelete={Delete} />
            ))}
            <div className="d-flex justify-content-center mt-3">
                {[...Array(totalPaginas)].map((_, i) => (
                    <button key={i} className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"} mx-1`} onClick={() => SetCurrentPage(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>
            <ProductoModal
                show={showModal}
                onHide={() => {
                    SetModalShow(false);
                    SetProductEdit(null);
                }}
                onSave={SaveProduct}
                productoEditar={productEdit}
            />
        </div>
    );
}