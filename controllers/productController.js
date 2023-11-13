const slugify = require('slugify');
const stripe = require('stripe')('sk_test_51OC7s0SFktuTX1QnKk5rcldnRM73EHZozAJLNLWGaOyS1hdLTAo2NbXhxbeFUqZxvWTceJ6uMcEsfHvzmmbA6nOP008uszOA9O');
const braintree = require('braintree');
const Product = require('./../models/productModel');
const Category = require('./../models/categoryModel');
const Order = require('./../models/orderModel');
const fs = require('fs');

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
  });

exports.createProductController = async (req,res) => {
try{
const {name,slug,description,price,category,quantity,shipping} = req.fields;
const {photo} = req.files;
switch(true){
        case !name:
        return res.status(500).send({error:'Name is Required'})
        case !description:
        return res.status(500).send({error:'description is Required'})
        case !price:
        return res.status(500).send({error:'price is Required'})
        case !category:
        return res.status(500).send({error:'category is Required'})
        case !quantity:
        return res.status(500).send({error:'quantity is Required'})
        case !photo:
        return res.status(500).send({error:'photo is Required'})
}
const products = new Product({
   ...req.fields,slug:slugify(name)
});

if(photo){
    products.photo.data = fs.readFileSync(photo.path)
    products.photo.contentType = photo.type;
}

await products.save();
res.status(201).send({
    success:true,
    message:'Product created Scuuessfully',
    products
})

}catch(error){
console.log(error);
res.status(500).send({
    success:false,
    error,
    message:'Error in creating product'
})
}
}

exports.getProductController = async (req,res) => {
    try{
        const products = await Product.find().select('-photo').limit(12).sort({createdAt:-1}).populate({path:'category',select:'-__v'});

        res.status(200).send({
            success:true,
            message:'all product',
            countTotal:products.length,
            products
        })
    }catch(error){
    console.log(error);
    res.status(500).send({
    success:false,
    error,
    message:'Error in getting product'
    })
    }
}

exports.getSingleProductController = async (req,res) => {
    try{
        const {slug} = req.params;

        const products = await Product.findOne({slug}).select('-photo').populate({path:'category',select:'-__v'});

        res.status(200).send({
            success:true,
            message:'product getted',
            products
        })
    }catch(error){
    console.log(error);
    res.status(500).send({
    success:false,
    error,
    message:'Error in getting product'
    })
    }
}

exports.productPhotoController = async(req,res) => {
    try{
        const product = await Product.findById(req.params.pid).select('photo');
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
            return res.status(200).send(product.photo.data);
        }
    }catch(error){
        console.log(error);
        res.status(500).send({
        success:false,
        error,
        message:'Error in getting photo'
        })
    }
}

exports.deleteProductController = async(req,res) => {
    try{
        await Product.findByIdAndDelete(req.params.pid);
        res.status(200).send({
            success:true,
            message:'product delete successfully',
            product:null
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
        success:false,
        error,
        message:'Error in deleting product'
        })
    }
}

exports.updateProductController = async(req,res) => {
    try{
        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
        switch(true){
                case !name:
                return res.status(500).send({error:'Name is Required'})
                case !description:
                return res.status(500).send({error:'description is Required'})
                case !price:
                return res.status(500).send({error:'price is Required'})
                case !category:
                return res.status(500).send({error:'category is Required'})
                case !quantity:
                return res.status(500).send({error:'quantity is Required'})
                case !photo:
                return res.status(500).send({error:'photo is Required'})
        }
        const products = await Product.findByIdAndUpdate(req.params.pid,{
           ...req.fields,slug:slugify(name)
        },{new:true});
        
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type;
        }
        
        await products.save();
        res.status(201).send({
            success:true,
            message:'Product updated Scuuessfully',
            products
        })
        
        }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in updating product'
        })
        }
}

exports.searchController = async(req,res) => {
    try{
        const {keyword} = req.params;
        const result = await Product.find({
            $or:[
                {name:{$regex:keyword,$options:'i'}},
                {description:{$regex:keyword,$options:'i'}}
            ]
        }).select('-photo');
        res.json(result);
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:'Error In search Product',
            error
        })
    }
}

exports.relatedProductController = async(req,res) => {
    try{
        const {pid,cid} = req.params;
        const products = await Product.find({
            category:cid,
            _id:{$ne:pid}
        }).select('-photo').limit(3).populate('category');
        res.status(200).send({
            success:true,
            message:'related products',
            products
        })

    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:'error while getting related product'
        })
    }
}

exports.productCategorycontroller = async (req,res) => {
    try{
        const category = await Category.findOne({slug:req.params.slug});
            const products = await Product.find({category}).populate('category');
            res.status(200).send({
                success:true,
                category,
                products
            });
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:'Error while gettting product',
            error
        })
    }
}

exports.braintreeTokenController = async (req,res) => {
    try{
        gateway.clientToken.generate({}, function(err,response){
            if(err)
            res.status(500).send(err)
            else
            res.send(response);
        });
    }catch(error){
           console.log(error);
           res.status(400).send({
            success:false,
            error
           })
    }
}

exports.brainTreePaymentController = async(req,res) => {
    try{
        const {cart,monce} = req.body;
        let total = 0;
        cart.map(i => {
            total += i.price
        });
        let newTransaction = gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }     
        },
        function(error,result){
         if(result){
            const order = new Order({
                products:cart,
                payment:result,
                buyer:req.user._id,

            }).save();
            res.json({
                ok:true
            })
         }
         else{
            res.status(500).send(error)
         }
        }
        )
    }catch(error){
           console.log(error);
           res.status(400).send({
            success:false,
            error
           })
}
}

exports.getCheckoutSession = async (req,res) => {
    try
    {
    const product = await Product.findById(req.params.pid);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email:req.user.email,
        client_reference_id:req.params.pid,
        line_items: [{
          price_data: {
          currency: 'inr',
          unit_amount: product.price,

          product_data: {
             name: `${product.name}`,
             description: product.description
      },
    },quantity: 1,
  }],
        mode:'payment',
    success_url: `${req.protocol}://${req.get('host')}/?product=${req.params.pid}&buyer=${req.user._id}`,
    cancel_url: `${req.protocol}://${req.get('host')}/`
    });

    res.status(200).json({
        success:'true',
        session
    });
}catch(error){
    res.status(500).send({
        success:false,
        error
    })
}
}
