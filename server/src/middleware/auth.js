import jwt from 'jsonwebtoken';
import {User} from '../models/models.js';
export async function auth(req,res,next){try{const token=(req.headers.authorization||'').replace('Bearer ','');if(!token)return res.status(401).json({message:'Authentication required'});const payload=jwt.verify(token,process.env.JWT_SECRET||'dev-secret');req.user=await User.findById(payload.id);if(!req.user)return res.status(401).json({message:'User not found'});next()}catch(e){res.status(401).json({message:'Invalid or expired token'})}}
export function admin(req,res,next){if(req.user?.role!=='admin')return res.status(403).json({message:'Admin access required'});next()}
