const JWT = require('jsonwebtoken');
const User = require('./../models/userModel');
const Bcrypt = require('./../helpers/authHelper');

exports.registerController = async (req,res) => {
    try{
        const {name,email,password,phone,address,answer} = req.body;
        if(!name)
        return res.status(401).send({error:'Name is required'});
        if(!email)
        return res.status(401).send({error:'email is required'});
        if(!password)
        return res.status(401).send({error:'password is required'});
        if(!phone)
        return res.status(401).send({error:'phone is required'});
        if(!address)
        return res.status(401).send({error:'address is required'});
        if(!answer)
        return res.status(401).send({error:'Answer is required'});

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
            address,
            answer
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

exports.forgotPasswordController = async (req,res) => {
try{
const {email,answer,newPassword} = req.body;
if(!email)
res.status(400).send({message:'Email is required'});

if(!answer)
res.status(400).send({message:'Answer is required'});

if(!newPassword)
res.status(400).send({message:'New password is required'});

const user = await User.find({email,answer});

if(!user)
return res.status(404).send({
    success:false,
    message:'Worng Email or Answer'
});
 
const hashed = await Bcrypt.hashPassword(newPassword);
await User.findByIdAndUpdate(user._id,{password:hashed});
res.status(200).send({
    success:true,
    message:'password Reset successfully'
});
}catch(error){
    res.status(500).send({
        success:false,
        message:'Something went worng',
        error
    });
}
}