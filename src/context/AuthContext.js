import { createContext, useContext } from "react";
export const AuthContext = createContext({user: null, userData: null, loading: false, roles: [], logout: () => {}});
export const useAuth = () => useContext(AuthContext);