import { Entity,PrimaryGeneratedColumn, Column,ManyToOne,JoinColumn} from "typeorm";
import { Product } from "./product";

@Entity('inventario_movimientos')
export class Invent{



@PrimaryGeneratedColumn()
id_movimiento!:number;


@Column()
id_producto!:number;



@Column()
id_usuario!: number;


@Column()
tipo_movimiento!: string;



@Column()
cantidad!: number;



@Column()
fecha_movimiento!: Date;


@Column()
descripcion!: string;


@ManyToOne(()=> Product,producto => producto.inventario_movimientos)
@JoinColumn({name:'id_producto'})
producto!: Product;





}