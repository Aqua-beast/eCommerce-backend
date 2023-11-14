const express = require('express');
const app = express();
const authRouter = require('./routers/authRouter');
const categoryRouters = require('./routers/categoryRouters');
const productRouters = require('./routers/productRouters');
const cors = require('cors');

const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOption))

app.use(express.json());
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/category',categoryRouters);
app.use('/api/v1/product',productRouters);

app.get('/', (req,res)=> {
    res.send({
        message:'this is our rest api'
    })
});


module.exports = app;