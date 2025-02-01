import User from '../model/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

// register
export const register = async(req, res)=>{
    try {

        // hashing password

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)
        console.log(hash)
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hash,
            photo:req.body.photo,
            role:req.body.role,
            user_role:req.body.user_role,
            description: req.body.description
        })
        console.log(newUser)
        await newUser.save()
        res.status(200).json({success:true, message:'Succesfully created'})
    } catch (err) {
        console.error("Registration Error:", err);  // Log the error
        res.status(500).json({success:false, message:'Failed to create. Try again',})
        
    }
}

// login
export const login = async(req, res)=>{
    const email = req.body.email;
    console.log('Heyy ' + req.user)
    try {
        const user = await User.findOne({email})
        console.log(user)
        // if not user
        if(!user){
            return res.status(404).json({success:false, message:'User not found'})
        }

        // if user exist then chacek the password
        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password)
        // if password is correct
        if(!checkCorrectPassword){
            return res.status(401).json({success:false, messages:'incorrect email or password'})
        }

        const {password, ...rest} = user._doc
        // what is _doc doing?

        // create jwt token
        const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET_KEY, {expiresIn:"15d"})

        // set token in the brower cookies and send to the client

        res.cookie('accessToken', token, {
            httpOnly:true,
            expires:token.expiresIn
        }).status(200).json({success:true, message:'successfuly login', token, data:{...rest}})
    } catch (err) {
        return res.status(401).json({success:false, messages:'Failed to login'})
        
    }
}