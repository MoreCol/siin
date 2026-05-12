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

  try{
    jwt.verify(token,process.env.JWT_SECRET as string);
    next()
  } catch(error){
    return res.status(401).json({message: 'token invalido' })
  }
  
}