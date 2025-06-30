import Swal from "sweetalert2";

export default function ProductoCard({ producto, onEdit, onDelete }) {
const daysLeft = Math.ceil((new Date(producto.vencimiento) - new Date()) / (1000 * 60 * 60 * 24));

let badge = "Disponible";
if (daysLeft <= 3 && daysLeft >= 0) badge = "Por vencer";
else if (daysLeft < 0) badge = "Vencido";

return (
    <div className="card mb-2">
    <div className="card-body">
        <h5 className="card-title">
        {producto.nombre} {producto.precio == 0 && <span className="text-success">(Gratis)</span>}
        </h5>
        <p className="card-text">{producto.descripcion}</p>
        <p>Vence: {producto.vencimiento} - <strong>{badge}</strong></p>
        <p>Precio: ${producto.precio} | Cantidad: {producto.cantidad}</p>
        <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(producto)}>Editar</button>
        <button className="btn btn-danger btn-sm" onClick={() => {
        Swal.fire({
            title: '¿Eliminar producto?',
            showCancelButton: true,
            confirmButtonText: 'Sí',
        }).then((result) => {
            if (result.isConfirmed) onDelete(producto.id);
        });
        }}>Eliminar</button>
    </div>
    </div>
);
}