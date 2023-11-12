const express = require('express');
const router = express.Router();
const authMiddleware = require('./../middlewares/authMiddleware');
const categoryController = require('./../controllers/categoryController')

router.post('/create-category',
authMiddleware.requireSignIn,
authMiddleware.isAdmin,
categoryController.createCategoryController);

router.put('/update-category/:id',
authMiddleware.requireSignIn,
authMiddleware.isAdmin,
categoryController.updateCategoryController)

router.get('/get-category',categoryController.categoryController);
router.get('/single-category/:slug',categoryController.singleCategoryController);


router.delete('/delete-category/:id',
authMiddleware.requireSignIn,
authMiddleware.isAdmin,
categoryController.deleteCategoryController);

module.exports = router;