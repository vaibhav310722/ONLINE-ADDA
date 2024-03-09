import express from 'express'
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js'
import {braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, searchController, similarProductController, updateProductController } from '../controller/productController.js'
import formidable from 'express-formidable'

const router=express.Router()

//routes
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)

//get all products
router.get('/get-product',getProductController)

//single product
router.get('/get-product/:slug',getSingleProductController)

//get photo
router.get('/product-photo/:pid',productPhotoController)

//delete product
router.delete('/delete-product/:pid',deleteProductController)

//update product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController) 

//filters product
router.post('/product-filters',productFilterController)

//product count
router.get('/product-count',productCountController)

//product page list
router.get('/product-list/:page',productListController)

//search product
router.get('/search/:keyword',searchController)

//similar product
router.get('/similar-product/:pid/:cid',similarProductController)

//category wise product
router.get('/product-category/:slug',productCategoryController)

//payment token route
router.get('/braintree/token',braintreeTokenController)

//payment
router.post('/braintree/payment',requireSignIn,braintreePaymentController)
export default router