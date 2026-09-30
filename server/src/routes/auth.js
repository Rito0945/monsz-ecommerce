import {Router} from 'express';import bcrypt from 'bcryptjs';import jwt from 'jsonwebtoken';import {User} from '../models/models.js';import {auth} from '../middleware/auth.js';
const sign = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );
};

r.post('/register',async(req,res)=>{try{const {name,email,password}=req.body;if(!name||!email||!password)return res.status(400).json({message:'Name, email and password are required'});if(password.length<8)return res.status(400).json({message:'Password must be at least 8 characters'});if(await User.findOne({email}))return res.status(409).json({message:'Email already registered'});const user=await User.create({name,email,password:await bcrypt.hash(password,12)});res.status(201).json({token:sign(user),user:{id:user._id,name:user.name,email:user.email,role:user.role}})}catch(e){res.status(500).json({message:e.message})}});
r.post('/login',async(req,res)=>{try{const {email,password}=req.body;const user=await User.findOne({email});if(!user||!(await bcrypt.compare(password,user.password)))return res.status(401).json({message:'Invalid email or password'});res.json({token:sign(user),user:{id:user._id,name:user.name,email:user.email,role:user.role}})}catch(e){res.status(500).json({message:e.message})}});
r.get('/me',auth,async(req,res)=>res.json({id:req.user._id,name:req.user.name,email:req.user.email,role:req.user.role,wishlist:req.user.wishlist}));
export default r;
