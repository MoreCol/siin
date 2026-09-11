import { AppDataSource } from '../config/dataBase';
import { Product } from '../entity/product';
import { Venta } from '../entity/ventas';
import { Pedido } from '../entity/pedidos';
import { Usuario } from '../entity/usuarios';

export class StatsService {
  private productoRepo = AppDataSource.getRepository(Product);
  private ventaRepo = AppDataSource.getRepository(Venta);
  private pedidoRepo = AppDataSource.getRepository(Pedido);
  private usuarioRepo = AppDataSource.getRepository(Usuario);

  async getResumen() {
    // Total productos
    const totalProductos = await this.productoRepo.count();

    // Productos con stock bajo
    const stockBajo = await this.productoRepo
      .createQueryBuilder('p')
      .where('p.stock_actual <= p.stock_minimo')
      .getCount();

    // Total ventas
    const totalVentas = await this.ventaRepo.count();

    // Ventas de hoy
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = await this.ventaRepo
      .createQueryBuilder('v')
      .where('CAST(v.fecha_venta AS DATE) = :hoy', { hoy })
      .getCount();

    // Total ingresos de hoy
    const ingresosHoy = await this.ventaRepo
      .createQueryBuilder('v')
      .select('SUM(v.total)', 'total')
      .where('CAST(v.fecha_venta AS DATE) = :hoy', { hoy })
      .getRawOne();

    // Pedidos pendientes
    const pedidosPendientes = await this.pedidoRepo.count({
      where: { estado: 'Pendiente' }
    });

    // Total usuarios
    const totalUsuarios = await this.usuarioRepo.count();

    // Últimas 5 ventas
    const ultimasVentas = await this.ventaRepo.find({
      order: { id_venta: 'DESC' },
      take: 5,
      relations: ['detalles']
    });

    return {
      totalProductos,
      stockBajo,
      totalVentas,
      ventasHoy,
      ingresosHoy: Number(ingresosHoy?.total || 0),
      pedidosPendientes,
      totalUsuarios,
      ultimasVentas
    };
  }
  
}
export {};