import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
  console.log('=== TOKEN VALIDATION ===');
  console.log('🌐 URL:', req.originalUrl);
  console.log('📋 Método:', req.method);
  console.log('📨 Headers completos:', JSON.stringify(req.headers, null, 2)); // 👈 AGREGAR
  console.log('🔑 Authorization:', req.headers.authorization);

  const tokenDelHeader = req.headers.authorization;
  if (!tokenDelHeader) {
    console.log('❌ NO HAY TOKEN EN EL HEADER');    
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
      id_rol: datos.id_rol
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
