import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetallePedido } from './detallePedido';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido!: number;

  @Column({ type: 'date' })
  fecha_pedido!: string;

  @Column({ type: 'date' })
  fecha_entrega!: string;

  @Column()
  estado!: string;

 /*@OneToMany(() => DetallePedido, detalles => detalles.pedido)
  detalles!: DetallePedido[];*/
}

