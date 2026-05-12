import { Request, Response } from 'express';
import { UsuarioService } from '../service/usuarios.service';

const service = new UsuarioService();

export const getUsuarios = async (_: Request, res: Response) => {
  res.json(await service.findAll());
};
export const getUsuario = async (req: Request, res: Response) => {
  const usuario = await service.findOne(Number(req.params.id));
  if (!usuario) return res.status(404).json({ message: 'usuario no encontrado' });
  res.json(usuario);
};
export const createUsuarios = async (req: Request, res: Response) => {

  try {
    const usuario = await service.create(req.body);
     res.status(201).json(usuario);
  } catch (error: any) {
     res.status(400).json({ message: error.message });
  }
  

};
export const updateUsuarios = async (req: Request, res: Response) => {
  const usuario = await service.update(Number(req.params.id), req.body);
  if (!usuario) return res.status(404).json({ message: 'usuario no actualizado' });
    res.json(usuario);


};
export const deleteUsuarios = async (req: Request, res: Response) => {
  const result = await service.delete(Number(req.params.id));
  if (result.affected === 0) return res.status(404).json({ message: 'usuario no encontrado ' })
    else res.status(204).send ()
  //no columnas
};

export {};
