import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedidos';
import { Product } from './product';
import { Proveedor } from './proveedores';

@Entity('detalle_pedido')
export class DetallePedido {
  @PrimaryGeneratedColumn()
  id_detalle_pedido!: number;
 /* @Column()
  id_pedido!: number;*/
  @Column()
  id_producto!: number;
  @Column()
  id_proveedor!: number;
  @Column()
  cantidad!: number;

  @ManyToOne(() => Product, producto => producto.detalle_pedido)
  @JoinColumn({ name: 'id_producto' })
  producto!: Product;

  /*@ManyToOne(() => Pedido, pedido => pedido.detalles)
  @JoinColumn({ name: 'id_pedido' })
  pedido!: Pedido;*/

  @ManyToOne(() => Proveedor, proveedor => proveedor.detalle_pedido)
  @JoinColumn({ name: 'id_proveedor' })
  proveedor!: Proveedor;
}
