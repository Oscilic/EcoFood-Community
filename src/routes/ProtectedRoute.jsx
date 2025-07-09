import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requeriedRole }) {
    const { user, roles, loading } = useAuth();
    if(loading){
        return <p className="text-center mt-10">Cargando sesión...</p>
    }
    if(!user){
        return <Navigate to="/login"/>;
    }
    if (requeriedRole){
        const allowedRoles = Array.isArray(requeriedRole) ? requeriedRole : [requeriedRole];
        if (!roles || !allowedRoles.some(role => roles.includes(role))) {
            return <Navigate to="/login"/>;
        }
    }
    return children;
}