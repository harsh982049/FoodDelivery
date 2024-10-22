const express = require('express');
const router = express.Router();
const {getMenu, getCartItems, increaseCartItem, decreaseCartItem, removeCartItem, removeUserCart, removeMenuItem, addToMenu, addOrder, fetchOrders} = require('../controllers/restaurantController');

router.get('/getMenu', getMenu);
router.get('/getCartItems/:userId', getCartItems);
router.patch('/increaseCartItem/:id/:userId', increaseCartItem);
router.patch('/decreaseCartItem/:id/:userId', decreaseCartItem);
router.delete('/removeCartItem/:id/:userId', removeCartItem);
router.delete('/removeUserCart/:userId', removeUserCart);
router.delete('/removeMenuItem/:id', removeMenuItem);
router.post('/addToMenu', addToMenu);
router.post('/addOrder', addOrder);
router.get('/fetchOrders/:id', fetchOrders);

module.exports = router;