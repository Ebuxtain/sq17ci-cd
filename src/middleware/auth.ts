import { NextFunction, Request, Response } from "express";
import  jwt from 'jsonwebtoken'
import { UserInstance } from "../model/user";

const jwtsecret = process.env.JWT_SECRET_KEY as string

export async function auth(req:Request| any, res:Response , next:NextFunction) {

    const authorization = req.headers.authorization

    if (!authorization){
        return res.status(401).json({error :'Kindly sign up as a user'})

    }
    
   const token = authorization.slice(7, authorization.length);

   let verified = jwt.verify(token, jwtsecret)
   if (!verified){
     return res.status(401).json({error:'invalid token, you canot access this route'})

   }

   const {id} = verified as {[key: string]:string}

   // Check user in database

   const user = await UserInstance.findOne({where:{id}})

   if (!user){
     return res.status(401).json({error: 'Kindly sign up in as a user'})
   }
  
   req.user = verified
   next()
}