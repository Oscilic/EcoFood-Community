import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
//común
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Recovery from "../pages/Recovery";
//layouts
import NavigationLayout from "../components/layouts/NavigationLayout";
//cliente
import ClientDashboard from "../pages/user/ClientDashboard";
import EditProfile from "../pages/user/EditProfile";
import MyOrders from "../pages/user/MyOrders";
import ProductView from "../pages/user/ProductView";
//admin
import AdminsAdmin from "../pages/admin/AdminsAdmin";
import MainAdmin from "../pages/admin/MainAdmin";
import UsersAdmin from "../pages/admin/UsersAdmin";
import BusinessAdmin from "../pages/admin/BusinessAdmin";
//empresa
import BusinessProducts from "../pages/business/BusinessProducts";
import BusinessProfile from "../pages/business/BusinessProfile";
import BusinessRequests from "../pages/business/BusinessRequests";

export default function AppRouter() {
    return (
        <Routes>
            {/* Rutas comunes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
            <Route path="/recovery" element={<Recovery />}/>
            {/* Rutas de cuentas*/}
            <Route element={<NavigationLayout/>}>
                {/* Rutas para cliente */}
                <Route path="/client/home" element={<ProtectedRoute requeriedRole="cliente"><ClientDashboard/></ProtectedRoute>}/>
                <Route path="/client/products" element={<ProtectedRoute requeriedRole="cliente"><ProductView/></ProtectedRoute>}/>
                <Route path="/client/orders" element={<ProtectedRoute requeriedRole="cliente"><MyOrders/></ProtectedRoute>}/>
                <Route path="/client/profile" element={<ProtectedRoute requeriedRole="cliente"><EditProfile/></ProtectedRoute>}/>
                {/* Rutas para admins */}
                <Route path="/admin/dashboard" element={<ProtectedRoute requeriedRole="admin"><MainAdmin/></ProtectedRoute>}/>
                <Route path="/admin/users" element={<ProtectedRoute requeriedRole="admin"><UsersAdmin/></ProtectedRoute>}/>
                <Route path="/admin/business" element={<ProtectedRoute requeriedRole="admin"><BusinessAdmin/></ProtectedRoute>}/>
                <Route path="/admin/management" element={<ProtectedRoute requeriedRole="admin"><AdminsAdmin/></ProtectedRoute>}/>
                {/* Rutas para empresas */}
                <Route path="/business/products" element={<ProtectedRoute requeriedRole="empresa"><BusinessProducts/></ProtectedRoute>}/>
                <Route path="/business/requests" element={<ProtectedRoute requeriedRole="empresa"><BusinessRequests/></ProtectedRoute>}/>
                <Route path="/business/profile" element={<ProtectedRoute requeriedRole="empresa"><BusinessProfile/></ProtectedRoute>}/>
            </Route>
            {/* Comodín  */}
            <Route path="*" element={<Navigate to ="/"/>}/>
        </Routes>
    );
}