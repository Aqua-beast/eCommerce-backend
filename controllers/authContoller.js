const JWT = require('jsonwebtoken');
const User = require('./../models/userModel');
const Bcrypt = require('./../helpers/authHelper');

exports.registerController = async (req,res) => {
    try{
        const {name,email,password,phone,address} = req.body;
        if(!name)
        return res.status(401).send({error:'Name is required'});
        if(!email)
        return res.status(401).send({error:'Name is email'});
        if(!password)
        return res.status(401).send({error:'Name is password'});
        if(!phone)
        return res.status(401).send({error:'Name is phone'});
        if(!address)
        return res.status(401).send({error:'Name is address'});

        const exisitingUser = await User.findOne({email});

        if(exisitingUser)
        return res.status(200).send({
            success:true,
            message:'Already Register please login'
        });

        const hashedPassword = await Bcrypt.hashPassword(password);
        const user = await new User({
            name,
            email,
            password:hashedPassword,
            phone,
            address
        }).save();

        res.status(201).send({
            success:true,
            message:'User Register Successfully',
            user,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Registeration',
            error
        })
    }
}

exports.loginController = async(req,res) => {
   
    try{
    const{email,password} = req.body;

    if(!email || !password)
    return res.status(404).send({
        success:false,
        message:'Invalid email or password'
    });

    const user = await User.findOne({email});
    if(!user)
    return res.status(404).send({
        success:false,
        message:'Email is not registerd'
    });

    const match  = await Bcrypt.comprePassword(password,user.password);
    if(!match)
    return res.status(200).send({
        success:false,
        message:'Invalid Password'
    });
    const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

    res.status(200).send({
        success:true,
        token
    });
}catch(error){
    res.status(500).send({
        success:false,
        message:'Error in login',
        error
    });
}
}

exports.testContoller = (req,res) => {
    console.log('protected router');
}