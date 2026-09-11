import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
  const tokenDelHeader = req.headers.authorization;
  if (!tokenDelHeader) {
    return res.status(401).json({ message: 'No se proporcionó token' });
  }
  const tokenExtraido = tokenDelHeader.split(' ')[1];
  if (!tokenExtraido) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }
  try {
    const datos = jwt.verify(tokenExtraido, process.env.JWT_SECRET as string) as {
      id: number;
      id_rol: number;
    };
    (req as any).usuario = {
      id: datos.id,
      id_rol: datos.id_rol,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
