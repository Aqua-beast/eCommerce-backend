const JWT = require('jsonwebtoken');
const User = require('./../models/userModel')
exports.requireSignIn = async (req,res,next) => {
    try{
        const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(error){
        res.send({error});
    }
}

exports.isAdmin = async (req,res,next) => {
    try{
        const user = await User.findById(req.user._id);
        if(user.role !== 1)
        return res.status(401).send({
            success:false,
            message:'UnAuthorized Access'
        });
        else
        next();
    }catch(error){
        console.log(error);
    }
}