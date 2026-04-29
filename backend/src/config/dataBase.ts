import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Product } from '../entity/product';
import { Invent } from '../entity/inventario';
import { Usuario } from '../entity/usuarios';
import { Rol } from '../entity/Rol';
import { Proveedor } from '../entity/proveedores';
import { Pedido } from '../entity/pedidos';
import { DetallePedido } from '../entity/detallePedido';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT ||'5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [Product,Invent,Usuario,Rol, Proveedor, Pedido,DetallePedido]
});

export const conexion= async() =>{
  try {
    await AppDataSource.initialize();
    console.log('Conexion Exitosa => BD');
  } catch (error) {
    console.error(' Error TypeORM:', error);
  }
}

