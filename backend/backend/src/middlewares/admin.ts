// backend/src/middlewares/isAdmin.ts
import { NextFunction, Request, Response } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // ✅ Usar 'usuario' en lugar de 'user'
    const usuario = (req as any).usuario;

    if (!usuario) {
        return res.status(401).json({
            success: false,
            message: '❌ No autenticado. Token requerido.'
        });
    }

    // ✅ Verificar el rol del usuario
    if (usuario.rol !== 'Administrador' && usuario.rol !== 'admin') {
        return res.status(403).json({
            success: false,
            message: '❌ Acceso denegado. Se requiere rol de Administrador.',
            tuRol: usuario.rol,
            rolesPermitidos: ['Administrador', 'admin']
        });
    }

    console.log(`✅ Acceso permitido a ${usuario.nombre} (${usuario.rol})`);
    next();
};