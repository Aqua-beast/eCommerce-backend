const slugify = require('slugify');
const Category = require('./../models/categoryModel');

exports.createCategoryController = async (req,res) => {
try{
    const {name} = req.body;
    if(!name)
    return res.status(401).send({message:'Name is required'});

    const existingCategory = await Category.findOne({name});
    if(existingCategory)
    return res.status(200).send({
        success:true,
        message:'Category Already Exisits'
    });

    const category = await new Category({name,
    slug:slugify(name)}).save();

    res.status(200).send({
        success:true,
        message:'new category added',
        category
    });
    
}catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error in Category',
        error
    });
}
};

exports.updateCategoryController = async (req,res) => {
    try{
        const {name} = req.body;
        const {id} = req.params;
        const category = await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:'Category updated successfully',
            category
        });
    }catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error while updating category',
        error
    });
    }
}

exports.categoryController = async (req,res) => {
    try{
        const category = await Category.find();
        res.status(200).send({
            success:true,
            message:'All category list',
            category
        })
    }catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error while getting all category',
        error
    });
    }
}

exports.singleCategoryController = async (req,res) => {
    try{
        const {slug} = req.params;
        const category = await Category.findOne({slug});
        res.status(200).send({
            success:true,
            message:'category getted',
            category
        })
    }catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error while getting category',
        error
    });
    }
}

exports.deleteCategoryController = async (req,res) => {
    try{
        const {id} = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:'category deleted successfully',
            category:null
        })
    }catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error while deleting category',
        error
    });
    }
}