import { NextFunction, Request,Response}from "express";

import jwt from 'jsonwebtoken'

export const TokenValidation = (req:Request,res:Response, next:NextFunction)=>{
    const authHeader = req.headers.authorization

    if ( !authHeader){
        return res.status(401).json({message:'no token '})
    }
    const token = authHeader.split(' ')[1]
     if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
        // ✅ Decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: number;
            nombre: string;
            apellido: string;
            correo: string;
            rol: string;
        };

        // ✅ GUARDAR EL USUARIO EN req.usuario
        (req as any).usuario = {
            id: decoded.id,
            nombre: decoded.nombre,
            apellido: decoded.apellido,
            correo: decoded.correo,
            rol: decoded.rol,
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: '❌ Token inválido o expirado' });
    }
  
}