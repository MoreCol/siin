import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...rolesPermitidos: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario;

      console.log('=== AUTHORIZE ROLES ===');
        console.log('🌐 URL:', req.originalUrl);          // 👈 AGREGAR
        console.log('📋 Método:', req.method);            // 👈 AGREGAR
        console.log('Usuario:', usuario);
        console.log('id_rol:', usuario?.id_rol);
        console.log('Roles permitidos:', rolesPermitidos);
        console.log('Incluye:', rolesPermitidos.includes(Number(usuario?.id_rol)));
        console.log('========================');   

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado. Token requerido.'
      });
    }

    if (!rolesPermitidos.includes(usuario.id_rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para acceder a este módulo.'
      });
    }

    next();
  };
};
