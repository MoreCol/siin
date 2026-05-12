import { AppDataSource } from '../config/dataBase';
import { Usuario } from '../entity/usuarios';
import jwt from 'jsonwebtoken';

export class AuthService {
  private repo = AppDataSource.getRepository(Usuario);

  //creacion de usuario nuevo
  async registro(data: Partial<Usuario>) {
    const existe = await this.repo.findOne({
      where: { correo: data.correo }
    });
    if (existe) {
      throw new Error('El correo ya está registrado');
    }
    const usuario = this.repo.create(data);
    return await this.repo.save(usuario);
  }
  //validamos usuario existente
  async login(correo: string, password: string) {
    const userValid = await this.repo
      .createQueryBuilder('usuario') //llama a la tabla usuarios
      .addSelect('usuario.password')
      .where('usuario.correo = :correo', { correo }) //filtra el correo
      .getOne();

    if (!userValid) {
      throw new Error('usuario no encontrado ');
    }

    const passwordValid = await userValid?.comparePassword(password);
    if (!passwordValid) {
      throw new Error('contraseña incorrecta');
    }

    const token = jwt.sign({ id: userValid.id_usuario }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    return { user: userValid, token };
  }
}
