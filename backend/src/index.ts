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
import statsRoutes from './routes/stats.routes';

const app = express();

// ✅ DESPUÉS (permite múltiples orígenes)
app.use(cors({
    origin: true,           // ✅ Permite todos los orígenes (desarrollo)
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
app.use('/api', statsRoutes);

// IMPORTANTE PARA RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});