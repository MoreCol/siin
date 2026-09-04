import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Usuario } from "./usuarios";

@Entity("roles")
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol!: number;

  @Column({ length: 50 , unique: true  })
  nombre_rol!: string;


  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios!: Usuario[];
}
