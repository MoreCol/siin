import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { Usuario } from './usuarios';
import { DetalleVenta } from './detalleVentas';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta!: number;

  @Column()
  id_usuario: number | undefined;

  @Column({
    type: 'timestamp'
  })
  fecha_venta: Date | undefined;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true
  })
  metodo_pago!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true
  })
  total!: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true
  })
  estado!: string;

  // // RELACIÓN CON USUARIO
   @ManyToOne(() => Usuario, usuario => usuario.ventas)
   @JoinColumn({ name: 'id_usuario' })
   usuario!: Usuario;

  // // RELACIÓN CON DETALLE VENTA
   @OneToMany(() => DetalleVenta, detalle => detalle.venta)
   detalles!: DetalleVenta[];
}
