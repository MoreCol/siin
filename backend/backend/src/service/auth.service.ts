import { AppDataSource } from '../config/dataBase';
import { Usuario } from '../entity/usuarios';
import jwt from 'jsonwebtoken';
import { Rol } from '../entity/Rol';

export class AuthService {
  private repo = AppDataSource.getRepository(Usuario);
  private rolRepo = AppDataSource.getRepository(Rol);

  //creacion de usuario nuevo
  async registro(data: Partial<Usuario>) {
  const existe = await this.repo.findOne({
    where: { correo: data.correo }
  });

  if (existe) {
    throw new Error('El correo ya está registrado');
  }

  let idRol = data.id_rol;

  if (!idRol) {
    const rolCajero = await this.rolRepo.findOne({
      where: { nombre_rol: 'Cajero' }
    });

    if (rolCajero) {
      idRol = rolCajero.id_rol;
    } else {
      throw new Error('No hay roles disponibles');
    }
  }

  // CREAR USUARIO
  const usuario = this.repo.create({
    nombre: data.nombre,
    apellido: data.apellido,
    correo: data.correo,
    password: data.password,
    id_rol: idRol,
    estado: true
  });

  // GUARDAR USUARIO
  await this.repo.save(usuario);

  return {
    message: 'Usuario registrado exitosamente',
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      id_rol: usuario.id_rol
    }
  };
}
  //validamos usuario existente
  async login(correo: string, password: string) {
    const userValid = await this.repo
      .createQueryBuilder('usuario') //llama a la tabla usuarios
      .addSelect('usuario.password')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .where('usuario.correo = :correo', { correo }) //filtra el correo
      .getOne();

    if (!userValid) {
      throw new Error('usuario no encontrado ');
    }

    const passwordValid = await userValid?.comparePassword(password);
    if (!passwordValid) {
      throw new Error('contraseña incorrecta');
    }
    const nombreRol = userValid.rol?.nombre_rol;

    const token = jwt.sign(
      {
        id: userValid.id_usuario,
        nombre: userValid.nombre,
        apellido: userValid.apellido,
        correo: userValid.correo,
        rol: nombreRol
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h'
      }
    );

    return {
      user: {
        id_usuario: userValid.id_usuario,
        nombre: userValid.nombre,
        apellido: userValid.apellido,
        correo: userValid.correo,
        rol: nombreRol
      },
      token
    };
  }
}
