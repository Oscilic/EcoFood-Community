import "./components/layouts/styles/GeneralStyle.css"
import "./components/layouts/styles/GeneralFont.css";
import Actividades from "./components/Actividades";
import { Navigate, useNavigate } from "react-router-dom";
function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Actividades />
      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="btn btn-primary" onClick={() => navigate("/login")}>Iniciar sesión</button>
        <button className="btn btn-secondary" onClick={() => navigate("/register")}>Registrarse</button>
      </div>
    </div>
  );
}
export default App;