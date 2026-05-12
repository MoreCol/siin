import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';

const servicio = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data = req.body;
      const user = await servicio.registro(data);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { correo, password } = req.body;
      const data = await servicio.login(correo, password);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
