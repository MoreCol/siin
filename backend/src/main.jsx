import ReactDOM from "react-dom/client";
import { App } from "./app.jsx"; // asegúrate de que la ruta sea correcta
import "./index.css"; // opcional, para estilos globales
import "../src/styles/layout.css"



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);