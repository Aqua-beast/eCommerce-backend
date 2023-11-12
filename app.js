const express = require('express');
const app = express();
const authRouter = require('./routers/authRouter');
const categoryRouters = require('./routers/categoryRouters');

app.use(express.json());
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/category',categoryRouters);

app.get('/', (req,res)=> {
    res.send({
        message:'this is our rest api'
    })
});


module.exports = app;