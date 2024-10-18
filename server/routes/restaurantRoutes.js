const express = require('express');
const router = express.Router();
const {getMenu, getMenuLength, getCartItems, increaseCartItem, decreaseCartItem, removeCartItem} = require('../controllers/restaurantController');

router.get('/getMenu', getMenu);
router.get('/getCartItems/:userId', getCartItems);
router.get('/getMenuLength', getMenuLength);
router.patch('/increaseCartItem/:id/:userId', increaseCartItem);
router.patch('/decreaseCartItem/:id/:userId', decreaseCartItem);
router.delete('/removeCartItem/:id/:userId', removeCartItem);

module.exports = router;