import express from 'express'
import cors from 'cors'
import {conexion} from './src/config/dataBase';
import productRoutes  from './src/routes/product.routes';
import inventRoutes from './src/routes/invent.rountes'
import { InventService } from './src/service/inventario.service';

const app =express()

app.use(cors({  // ← 2. AGREGAR CORS
  origin: 'http://localhost:5173',  // ← Tu frontend Vite

}));


app.use(express.json())

const PUERTO = 3000
conexion();

app.use ('/api',productRoutes)



app.listen(PUERTO, ()=>{
    

    console.log(`servidor siin corriendo en puerto ${PUERTO}`)
});