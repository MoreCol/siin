import express from "express";
import cors from "cors";  // ← 1. npm install cors @types/cors
import productRoutes from "./routes/product.routes";
import inventRoutes from "./routes/invent.rountes";
import usuariosRoutes from "./routes/usuarios.routes";
import { conexion } from "./config/dataBase";


const app = express();

app.use(cors({  // ← 2. AGREGAR CORS
  origin: 'http://localhost:5173'  // ← Tu frontend Vite
}));

app.use(express.json());

// conectar DB
conexion();

// usar rutas 
app.use("/api", productRoutes);
app.use("/api", inventRoutes );
app.use("/api", usuariosRoutes)

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});