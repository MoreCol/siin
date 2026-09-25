import { AppDataSource } from '../config/dataBase';
import { Usuario } from '../entity/usuarios';
import jwt from 'jsonwebtoken';
import { Rol } from '../entity/Rol';

export class AuthService {
  private repo = AppDataSource.getRepository(Usuario);
  private rolRepo = AppDataSource.getRepository(Rol);

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
        throw new Error('no hay role disponibles');
      }

      const usuario = this.repo.create({
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        password: data.password,
        id_rol: idRol,
        estado: true
      });
      await this.repo.save(usuario);

      return {
        message: 'usuario registrado exitosamente',
        usuario: {
          nombre: usuario.nombre,
          correo: usuario.correo,
          id_rol: usuario.id_rol
        }
      };
    }
  }

  async login(correo: string, password: string) {
    console.log('=== LOGIN ===');
    console.log('📧 Correo recibido:', JSON.stringify(correo));
    console.log('🔑 Password recibida:', JSON.stringify(password));
    console.log('📏 Longitud correo:', correo.length);
    console.log('📏 Longitud password:', password.length);

    const userValid = await this.repo
      .createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .where('usuario.correo = :correo', { correo })
      .getOne();

    console.log('👤 userValid:', userValid);

    if (!userValid) {
      console.log('❌ Usuario no encontrado');
      throw new Error('usuario no encontrado ');
    }

    // 🔥 AGREGAR MÁS LOGS
    console.log('🔑 Comparando contraseña...');
    const passwordValid = await userValid.comparePassword(password);
    console.log('🔑 passwordValid:', passwordValid);

    if (!passwordValid) {
      console.log('❌ Contraseña incorrecta');
      throw new Error('contraseña incorrecta');
    }

    // 🔥 AGREGAR MÁS LOGS
    console.log('✅ Generando token...');
    const token = jwt.sign(
      {
        id: Number(userValid.id_usuario),
        id_rol: Number(userValid.id_rol)
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    console.log('✅ Token generado:', token.substring(0, 50) + '...');

    return {
      user: {
        id_usuario: userValid.id_usuario,
        nombre: userValid.nombre,
        apellido: userValid.apellido,
        correo: userValid.correo,
        id_rol: userValid.id_rol
      },
      token
    };
  }
}
