// backend/src/entity/ventas.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from './usuarios';
import { DetalleVenta } from './detalleVentas';

@Entity('ventas')
export class Venta {
    @PrimaryGeneratedColumn()
    id_venta!: number;

    // ✅ Columna directa (para usar en create/update)
    @Column({ type: 'int', nullable: false })
    id_usuario!: number;

    // ✅ Relación (para consultas con JOIN)
    @ManyToOne(() => Usuario, (usuario) => usuario.ventas)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuario;

    @Column({ type: 'timestamp' })
    fecha_venta!: Date;

    @Column({ type: 'varchar', length: 20, nullable: true })
    metodo_pago!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total!: number;

    @Column({ type: 'varchar', length: 20, nullable: true })
    estado!: string;

    @OneToMany(() => DetalleVenta, (detalle) => detalle.venta)
    detalles!: DetalleVenta[];
}