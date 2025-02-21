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


export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        const authenticatedUserId = req.user.id;
        const userRole = req.user.user_role;

        if (!authenticatedUserId) {
            return res.status(401).json({ success: false, message: "User ID not found in token" });
        }

        // Allow admins to access all resources
        if (userRole === 'admin') {
            return next();
        }

        // Proceed if the user is authenticated (no need for user ID in params)
        return next();
    });
};

export const verifySeller = (req, res, next)=>{
    verifyToken(req, res, ()=>{
        console.log(req.user)
        if(req.user.role === 'seller'){
            next()
        }
        else{
            return res.status(401).json({success:false, message:"You are not authorized"})
        }
    })
}