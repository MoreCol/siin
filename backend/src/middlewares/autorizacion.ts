import { Request, Response, NextFunction } from 'express';


export const authorizeRoles = (...rolesPermitidos: number[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const usuario = (req as any).usuario;

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado. Token requerido.'
            });
        }

        if (!rolesPermitidos.includes(usuario.id_rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para acceder a este módulo.',
              
            });
        }

        next();
    };
};