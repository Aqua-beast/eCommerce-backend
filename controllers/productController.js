const slugify = require('slugify');
const Product = require('./../models/productModel');
const fs = require('fs');

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