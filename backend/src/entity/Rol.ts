import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Usuario } from "./usuarios";

@Entity("roles")
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol!: number;

  @Column({ length: 50 })
  nombre!: string;

  @Column({ default: true })
  activo!: boolean;

  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios!: Usuario[];
}
