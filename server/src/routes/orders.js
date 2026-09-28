import {Router} from 'express';import {auth} from '../middleware/auth.js';import {Order} from '../models/models.js';
const r=Router();
r.post('/',auth,async(req,res)=>{try{const {items,shippingAddress,paymentMethod,subtotal,shipping=0,discount=0,total}=req.body;if(!items?.length)return res.status(400).json({message:'Cart is empty'});const order=await Order.create({user:req.user._id,email:req.user.email,items,shippingAddress,paymentMethod,subtotal,shipping,discount,total});res.status(201).json(order)}catch(e){res.status(500).json({message:e.message})}});
r.get('/',auth,async(req,res)=>res.json(await Order.find({user:req.user._id}).sort({createdAt:-1})));
r.get('/:id',auth,async(req,res)=>{const o=await Order.findOne({_id:req.params.id,user:req.user._id});if(!o)return res.status(404).json({message:'Order not found'});res.json(o)});
export default r;
