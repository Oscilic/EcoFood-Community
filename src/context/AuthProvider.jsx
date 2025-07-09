import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "./AuthContext";
import { GetUserData } from "../services/userService";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, SetUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const roles = ["admin", "cliente", "empresa", "superadmin"];
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if(currentUser) {
                setUser(currentUser);
                try {
                    const data= await GetUserData(currentUser.uid);
                    SetUserData(data);
                } catch (error) {
                    console.error("Error al obtener datos desde firestore: ", error);
                    SetUserData(null);
                }
            } else {
                setUser(null);
                SetUserData(null);
            }
            setLoading(false);
        document.title = "Cargando...";
        });
        return () => unsubscribe();
    }, []);
    const logout = async () => {
        await signOut(auth);
        setUser(null);
        SetUserData(null);
    };
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        )
    }
    return (
    <AuthContext.Provider value={{ user, userData, loading , roles, logout}}>
        {children}
    </AuthContext.Provider>
    );
}