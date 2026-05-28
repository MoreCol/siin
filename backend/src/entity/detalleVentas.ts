import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Venta } from './ventas';
import { Product } from './product';

@Entity('detalle_venta')
export class DetalleVenta {
  @PrimaryColumn({
    type: 'varchar',
    length: 10
  })
  id!: string;

  @Column()
  id_producto!: number;

  @Column()
  id_venta!: number;

  @Column()
  cantidad!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true
  })
  subtotal!: number;

  // RELACIÓN CON VENTA
   @ManyToOne(() => Venta, venta => venta.detalles)
   @JoinColumn({ name: 'id_venta' })
   venta!: Venta;

  // // RELACIÓN CON PRODUCTO
   @ManyToOne(() => Product, producto => producto.detallesVenta)
   @JoinColumn({ name: 'id_producto' })
   producto!: Product;
   static producto: any;
}
