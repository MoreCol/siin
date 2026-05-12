import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Rol } from '../entity/Rol';
import bcrypt from 'bcryptjs';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  correo!: string;

  @Column({ select: false })
  password!: string;

  @Column({default:2})
  id_rol!: number;

  @Column()
  estado!: boolean;

  @ManyToOne(() => Rol, rol => rol.usuarios)
  @JoinColumn({ name: 'id_rol' })
  rol!: Rol;

  @BeforeInsert() // antes de guardar usuario
  @BeforeUpdate() //antes de actualizar user
  async hashPassword() {
    //verifica existencia del password
    const inHashed = /^\$2[aby]\$/.test(this.password);
    if (this.password && !inHashed) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  // 
  //metodo de comparacion
  async comparePassword(password: string) {
    //compara password texto-encriptado
    return bcrypt.compare(password, this.password);
  }
}
