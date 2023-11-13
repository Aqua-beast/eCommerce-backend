const express = require('express');
const formidable = require('express-formidable');
const productController = require('./../controllers/productController');
const authMiddleware = require('./../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-product',
authMiddleware.requireSignIn,
authMiddleware.isAdmin,
formidable(),
productController.createProductController);

router.get('/get-product',productController.getProductController);

router.get('/get-product/:slug',productController.getSingleProductController);

router.get('/product-photo/:pid',productController.productPhotoController);

router.delete('/delete-product/:pid',productController.deleteProductController);

router.put('/update-product/:pid',
authMiddleware.requireSignIn,
authMiddleware.isAdmin,
formidable(),
productController.updateProductController);

router.get('/search/:keyword',productController.searchController);

router.get('/related-product/:pid/:cid',productController.relatedProductController);

router.get('/product-category/:slug',productController.productCategorycontroller);

router.get('/braintree/token',productController.braintreeTokenController);

router.post('/braintree/payment',authMiddleware.requireSignIn,productController.brainTreePaymentController);

router.get('/stripe/checkout-session/:pid',authMiddleware.requireSignIn,productController.getCheckoutSession);

module.exports = router;