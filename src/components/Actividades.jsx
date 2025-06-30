import "./Actividades.css";
import { useState } from "react";

const cardsData = [
    {
        titulo: "Educamos",
        texto:
        "Ofrecemos materiales educativos gratuitos y talleres comunitarios para fomentar prácticas sostenibles en el consumo de alimentos.",
        extra:
        "Además de proporcionar materiales educativos, organizamos eventos comunitarios donde compartimos prácticas alimentarias responsables y sostenibles. Estos talleres incluyen desde el cultivo de alimentos en espacios pequeños, hasta la conservación y aprovechamiento de productos en su totalidad, evitando el desperdicio. Enseñamos a las comunidades sobre la importancia de la alimentación consciente, cómo reducir el impacto ambiental de sus hábitos y cómo hacer uso eficiente de los recursos alimenticios disponibles. También brindamos herramientas digitales que permiten a los participantes acceder a guías y consejos prácticos sobre cómo aplicar estos conocimientos en su vida diaria. Creemos firmemente que una población bien informada es clave para transformar los hábitos de consumo hacia un futuro más sostenible."
    },
    {
        titulo: "Conectamos",
        texto:
        "Promovemos alianzas entre productores, comerciantes, consumidores y comunidades para reducir excedentes y aprovechar al máximo los alimentos disponibles.",
        extra:
        "Nuestra misión es crear redes de colaboración entre diferentes actores dentro de la cadena de suministro alimentario. Conectamos a agricultores locales con minoristas y consumidores para minimizar los excedentes de producción, evitando así el desperdicio de alimentos. Además, trabajamos en estrecha colaboración con ONGs y gobiernos para promover políticas públicas que favorezcan la redistribución de alimentos no vendidos a quienes más lo necesitan. Estas alianzas permiten mejorar la eficiencia en el uso de los recursos y generar un impacto positivo en las economías locales, reduciendo la huella de carbono asociada al transporte de productos y fomentando la solidaridad comunitaria. También promovemos el intercambio de buenas prácticas entre los participantes para mejorar continuamente los procesos de producción y distribución."
    },
    {
        titulo: "Innovamos",
        texto:
        "Utilizamos la tecnología para desarrollar soluciones prácticas, como aplicaciones móviles, plataformas web y redes comunitarias que faciliten la reducción del desperdicio alimentario.",
        extra:
        "Además de nuestras aplicaciones móviles y plataformas web, estamos desarrollando tecnologías innovadoras que permiten a los consumidores identificar fácilmente productos cercanos a su fecha de vencimiento, lo que les permite hacer compras más responsables. También estamos implementando sistemas de trazabilidad digital que permiten rastrear el origen de los productos alimenticios, asegurando que se usen de manera más eficiente. Nuestras redes comunitarias en línea facilitan la interacción entre productores, distribuidores y consumidores, promoviendo el intercambio de alimentos en lugar de su descarte. Mediante el uso de inteligencia artificial, estamos desarrollando algoritmos que predicen las necesidades de los mercados locales, ayudando a los productores a ajustar su oferta a la demanda real y reduciendo los excesos que terminan en la basura. Además, trabajamos con startups tecnológicas para crear soluciones basadas en blockchain que garanticen la transparencia en la distribución de alimentos y en el uso de recursos. Estas innovaciones no solo buscan reducir el desperdicio alimentario, sino también transformar la manera en que interactuamos con los alimentos, promoviendo la eficiencia y la sostenibilidad."
    }
    ];
function Card({ titulo, texto, extra }) {
    const [visible, SetVisible] = useState(false);
    return (
        <div className="cards">
            <h3>{titulo}</h3>
            <p>{texto}</p>
            {visible && <p className="extra-texto">{extra}</p>}
            <button onClick={() => SetVisible(!visible)}>
                {visible ? "- INFO" : "+ INFO"}
            </button>
        </div>
    );
}
function Actividades() {
    return (
        <section id="actividades">
        <div className="container">
            <h2>Que Hacemos:</h2>
            <div className="ayudantias">
            {cardsData.map((carta, i) => (
                <Card
                key={i}
                titulo={carta.titulo}
                texto={carta.texto}
                extra={carta.extra}
                />
            ))}
            </div>
        </div>
        </section>
    );
}
export default Actividades;