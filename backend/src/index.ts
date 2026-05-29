import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes";
import inventRoutes from "./routes/invent.rountes";
import usuariosRoutes from "./routes/usuarios.routes";
import proveedoresRouter from "./routes/proveedores.routes";
import pedidosRouter from "./routes/pedidos.routes";
import detallePedidoRouter from "./routes/detallePedido.routes";
import authRoutes from "./routes/auth.routes";
import ventaRoutes from "./routes/venta.routes";
import { conexion } from "./config/dataBase";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://6a189d67d27c500008763f54--incredible-alpaca-6899dc.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());

// conectar DB
conexion();

// rutas
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", inventRoutes);
app.use("/api", usuariosRoutes);
app.use("/api", proveedoresRouter);
app.use("/api", pedidosRouter);
app.use("/api", detallePedidoRouter);
app.use("/api", ventaRoutes);

// IMPORTANTE PARA RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});