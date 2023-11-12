const express = require('express');
const app = express();
const authRouter = require('./routers/authRouter');
app.use(express.json());
app.use('/api/v1/auth',authRouter);
app.get('/', (req,res)=> {
    res.send({
        message:'this is our rest api'
    })
});


module.exports = app;