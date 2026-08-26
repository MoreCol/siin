import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Invent } from './inventario';
import { DetallePedido } from './detallePedido';
import { DetalleVenta } from './detalleVentas';

@Entity('productos')
export class Product {
  //ID AUTOINCREMENTAL
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  codigo_barras!: string;

  @Column()
  descripcion!: string;

  @Column()
  categoria!: string;

  @Column('decimal')
  precio_compra!: number;

  @Column('decimal')
  precio_venta!: number;

  @Column()
  stock_actual!: number;

  @Column()
  stock_minimo!: number;

  @Column()
  proveedor_id!: number;

  @Column()
  estado!: string;

  @Column('decimal', {
  precision: 5,
  scale: 2,
  default: 40
})
  porcentaje_ganancia!: number;

  @OneToMany(() => Invent, invent => invent.producto)
  inventario_movimientos!: Invent[];
  @OneToMany(() => DetallePedido, detalle => detalle.producto)
  detalle_pedido!: DetallePedido[];

  @OneToMany(() => DetalleVenta, detalleVenta => DetalleVenta.producto)
  detallesVenta: DetalleVenta[] | undefined;
}
