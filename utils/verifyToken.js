import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next)=>{
    const token = req?.cookies?.accessToken;

    if(!token){
        return res.status(401).json({success:false, message:'You are not authorized'})
    }

    // if token exist then verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
        console.log(user)
        if(err){
            return res.status(401).json({success:false, message:'token is invalid'})
        }

        req.user = user;
        next()
    })
}

export const verifyUser = (req, res, next)=>{
    verifyToken(req, res, next, ()=>{
        // console.log(reg.user)
        // console.log(req.params)
        if(req.user.id === req.params.id || req.user.user_role === 'admin'){
            next()
        }
        else{
            return res.status(401).json({success:false, message:"You are not aunthenticated"})
        }
    })
}
export const verifySeller = (req, res, next)=>{
    verifyToken(req, res, next, ()=>{
        if(req.user.user_role === 'admin'){
            next()
        }
        else{
            return res.status(401).json({success:false, message:"You are not authorized"})
        }
    })
}