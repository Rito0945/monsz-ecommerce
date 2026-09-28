import {Router} from 'express';
import {auth,admin} from '../middleware/auth.js';
import {Product,Order,User} from '../models/models.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const r=Router();
r.use(auth,admin);

const uploadDir=path.resolve(process.cwd(),'uploads/products');
fs.mkdirSync(uploadDir,{recursive:true});
const storage=multer.diskStorage({
  destination:(req,file,cb)=>cb(null,uploadDir),
  filename:(req,file,cb)=>{
    const ext=path.extname(file.originalname).toLowerCase();
    const safe=path.basename(file.originalname,ext).replace(/[^a-z0-9-_]/gi,'-').toLowerCase();
    cb(null,`${Date.now()}-${safe}${ext}`);
  }
});
const imageUpload=multer({
  storage,
  limits:{fileSize:8*1024*1024,files:12},
  fileFilter:(req,file,cb)=>cb(null,/^image\/(jpeg|png|webp|avif)$/.test(file.mimetype))
});

r.get('/stats',async(req,res)=>res.json({
  products:await Product.countDocuments(),
  published:await Product.countDocuments({published:true}),
  customers:await User.countDocuments({role:'customer'}),
  orders:await Order.countDocuments(),
  sales:(await Order.aggregate([{$match:{paymentStatus:'Paid'}},{$group:{_id:null,total:{$sum:'$total'}}}]))[0]?.total||0,
  lowStock:await Product.countDocuments({'variants.stock':{$lte:5}})
}));

r.get('/products',async(req,res)=>res.json(await Product.find().sort({createdAt:-1})));
r.get('/products/:id',async(req,res)=>{
  const p=await Product.findById(req.params.id);
  if(!p)return res.status(404).json({message:'Product not found'});
  res.json(p);
});

r.post('/products',async(req,res)=>{
  try{
    const payload={...req.body};
    if(typeof payload.variants==='string')payload.variants=JSON.parse(payload.variants);
    if(typeof payload.colors==='string')payload.colors=JSON.parse(payload.colors);
    if(typeof payload.sizes==='string')payload.sizes=JSON.parse(payload.sizes);
    if(typeof payload.images==='string')payload.images=JSON.parse(payload.images);
    const product=await Product.create(payload);
    res.status(201).json(product);
  }catch(e){res.status(400).json({message:e.message})}
});

r.put('/products/:id',async(req,res)=>{
  try{
    const payload={...req.body};
    for(const k of ['variants','colors','sizes','images']) if(typeof payload[k]==='string')payload[k]=JSON.parse(payload[k]);
    const product=await Product.findByIdAndUpdate(req.params.id,payload,{new:true,runValidators:true});
    if(!product)return res.status(404).json({message:'Product not found'});
    res.json(product);
  }catch(e){res.status(400).json({message:e.message})}
});

r.delete('/products/:id',async(req,res)=>{await Product.findByIdAndDelete(req.params.id);res.json({ok:true})});

r.post('/products/:id/images',imageUpload.array('images',12),async(req,res)=>{
  try{
    const product=await Product.findById(req.params.id);
    if(!product)return res.status(404).json({message:'Product not found'});
    const urls=req.files.map(f=>`/uploads/products/${f.filename}`);
    product.images=[...(product.images||[]),...urls];
    await product.save();
    res.json({images:urls,product});
  }catch(e){res.status(400).json({message:e.message})}
});

r.delete('/products/:id/images',async(req,res)=>{
  const {url}=req.body;
  const product=await Product.findById(req.params.id);
  if(!product)return res.status(404).json({message:'Product not found'});
  product.images=(product.images||[]).filter(x=>x!==url);
  await product.save();
  if(url?.startsWith('/uploads/products/')){
    const file=path.resolve(process.cwd(),url.replace(/^\//,''));
    if(fs.existsSync(file))fs.unlinkSync(file);
  }
  res.json(product);
});

r.get('/inventory',async(req,res)=>{
  const products=await Product.find({},'name slug variants');
  const rows=[];
  for(const p of products) for(const v of p.variants||[]) rows.push({_id:`${p._id}-${v.sku}`,productId:p._id,product:p.name,slug:p.slug,...v.toObject()});
  res.json(rows);
});

r.patch('/inventory',async(req,res)=>{
  const {productId,sku,stock}=req.body;
  if(!productId||!sku||stock===undefined)return res.status(400).json({message:'productId, sku and stock are required'});
  const product=await Product.findById(productId);
  if(!product)return res.status(404).json({message:'Product not found'});
  const variant=product.variants.find(v=>v.sku===sku);
  if(!variant)return res.status(404).json({message:'Variant not found'});
  variant.stock=Math.max(0,Number(stock));
  await product.save();
  res.json({ok:true,stock:variant.stock});
});

r.get('/orders',async(req,res)=>res.json(await Order.find().populate('user','name email').sort({createdAt:-1})));
r.patch('/orders/:id',async(req,res)=>res.json(await Order.findByIdAndUpdate(req.params.id,req.body,{new:true})));

export default r;
