import jwt from 'jsonwebtoken';
export function signUser(user){return jwt.sign({id:user.id,username:user.username,role:user.role,displayName:user.display_name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'8h'});}
export function auth(req,res,next){const h=req.headers.authorization||'';const token=h.startsWith('Bearer ')?h.slice(7):null;if(!token)return res.status(401).json({message:'Authentication required'});try{req.user=jwt.verify(token,process.env.JWT_SECRET);next()}catch{res.status(401).json({message:'Invalid or expired token'})}}
export const allow=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'Insufficient permissions'});
