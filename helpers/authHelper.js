const bcrypt = require('bcrypt');

exports.hashPassword = async (password) => {
    try{
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password,saltRound);
        return hashedPassword;
    }catch(err){
        console.log(err.message);
    }
};

exports.comprePassword = async (password,hashedPassword) => {
    return await bcrypt.compare(password,hashedPassword);
}

