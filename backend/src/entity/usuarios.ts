import { Entity,PrimaryGeneratedColumn, Column,ManyToOne,JoinColumn} from "typeorm";
import { Rol } from "../entity/Rol";


@Entity('usuarios')
export class Usuario{



@PrimaryGeneratedColumn()
id_usuario!:number;


@Column()
nombre!:string;



@Column()
apellido!: string;


@Column()
correo!: string;



@Column()
password!: string;



@Column()
id_rol!: number;


@Column()
estado!: boolean;


 @ManyToOne(() => Rol, rol => rol.usuarios)
  @JoinColumn({ name: "id_rol" })
  rol!: Rol;


}