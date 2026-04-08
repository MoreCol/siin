import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Invent } from "./inventario";

@Entity("productos")
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

  @Column("decimal")
  precio_compra!: number;

  @Column("decimal")
  precio_venta!: number;

  @Column()
  stock_actual!: number;

  @Column()
  stock_minimo!: number;

  @Column()
  proveedor_id!: number;

  @Column()
  estado!: string;

  @OneToMany(()=> Invent, invent=> invent.producto)
  inventario_movimientos!:Invent[]
}