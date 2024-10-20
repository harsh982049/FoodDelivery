const express = require('express');
const router = express.Router();
const {getMenu, getCartItems, increaseCartItem, decreaseCartItem, removeCartItem, removeMenuItem, addToMenu} = require('../controllers/restaurantController');

router.get('/getMenu', getMenu);
router.get('/getCartItems/:userId', getCartItems);
router.patch('/increaseCartItem/:id/:userId', increaseCartItem);
router.patch('/decreaseCartItem/:id/:userId', decreaseCartItem);
router.delete('/removeCartItem/:id/:userId', removeCartItem);
router.delete('/removeMenuItem/:id', removeMenuItem);
router.post('/addToMenu', addToMenu);

module.exports = router;