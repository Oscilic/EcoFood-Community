import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "./AuthContext";
import { GetUserData } from "../services/userService";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, SetUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const roles = ["admin", "cliente", "empresa"];
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
        });
        return () => unsubscribe();
    }, []);
    if (loading) {
        return <div>Cargando autenticación...</div>;
    }
    return (
    <AuthContext.Provider value={{ user, userData, loading , roles}}>
        {children}
    </AuthContext.Provider>
    );
}