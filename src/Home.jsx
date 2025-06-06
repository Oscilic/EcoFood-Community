import CardProducto from '../components/CardProducto';
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";

function Home() {
    return (
        <div className="container mt-4">
            <h1>Productos Disponibles</h1>
            <CardProducto nombre="Pan Integral" precio="$500"/>
        </div>
    );
}
useEffect(() => {
    const fetch = async () => {
        const datos = await getUserData(user.uid);
        setUserData(datos);
    };
    if (user) fetch();
}, [user]);

export default Home;