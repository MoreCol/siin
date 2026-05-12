import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

import { DetallePedido } from "./detallePedido";


@Entity("proveedores")
export class Proveedor{
@PrimaryGeneratedColumn()
id_proveedor!:number;

@Column()
nit!: number;
@Column()
nombre!:string;
@Column()
telefono!:string;
@Column()
correo!: string;
@Column()
direccion!: string;


@OneToMany(() => DetallePedido, detalle => detalle.proveedor)
  DetallePedido!: DetallePedido[];

}