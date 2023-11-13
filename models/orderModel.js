const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    products:[{
        type:mongoose.ObjectId,
        ref:'Product'
    }],
    payment:{},
    buyed:{
        type:mongoose.ObjectId,
        ref:'users'
    },
    status:{
        type:String,
        default:'Not Process',
        enum:['Not Process','Processing','Shipping','delivered','cancel']
    }
},{
    timestamps:true
});

const Model = mongoose.model('Order',orderSchema);

module.exports = Model;