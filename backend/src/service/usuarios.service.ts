import { AppDataSource } from '../config/dataBase';
import { Usuario } from '../entity/usuarios';

export class UsuarioService {
  //cclase servicio

  private repo = AppDataSource.getRepository(Usuario); //repositorio de usuarios

  async findAll() {
    return this.repo.find()
  }
  async findOne(id: number) {
    return this.repo.findOneBy({id_usuario:id}); //buscar por pk
  }
  async create(data: Partial<Usuario>) {
    const usuario = this.repo.create(data);
    return await this.repo.save(usuario);
  }
  async update(id: number, data: Partial<Usuario>) {
    const usuario = await this.findOne(id);
    if (!usuario) return null;

    this.repo.merge(usuario, data);
    return await this.repo.save(usuario);
  }
  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
