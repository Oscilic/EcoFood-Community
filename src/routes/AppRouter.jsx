import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import RecuperarContraseña from "../pages/Recovery";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/home" element={
                <ProtectedRoute>
                    <Home/>
                </ProtectedRoute>
            }/>
            <Route path="/recuperar" element={<RecuperarContraseña />}/>
        </Routes>
    );
}