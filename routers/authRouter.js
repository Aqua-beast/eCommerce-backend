const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authContoller');
const authMiddleware = require('./../middlewares/authMiddleware')

router.post('/register',authController.registerController);
router.post('/login',authController.loginController);
router.post('/forgot-password',authController.forgotPasswordController);
router.get('/test',authMiddleware.requireSignIn,authMiddleware.isAdmin,authController.testContoller);
router.put('/profile',authMiddleware.requireSignIn,authController.updateProfileController);

router.get('.user-auth',authMiddleware.requireSignIn, (req,res) => {
    res.status(200).send({ok:true});
})

router.get('/orders',authMiddleware.requireSignIn,authController.getOrdersController);

module.exports = router;   