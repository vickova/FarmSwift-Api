import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Forbidden - Invalid token" });

        req.user = user; // Attach user info to request
        next();
    });
};


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