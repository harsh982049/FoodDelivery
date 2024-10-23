const Menu = require('../model/menuModel');
const Cart = require('../model/cartModel');
const Order = require('../model/orderModel');

const getMenu = async (req, res, next) => {
    try
    {
        const {cuisine} = req.query;
        let foodItems;
        if(!cuisine) foodItems = await Menu.find({});
        else foodItems = await Menu.find({category: cuisine});

        if(!foodItems)
        {
            return res.json({status: false,  msg: 'Could not fetch menu right now. Please try again.'});
        }
        return res.json({status: true, menu: foodItems});
    }
    catch(error)
    {
        next(error);
    }
};

const getMenuLength = async (req, res, next) => {
    try
    {
        const length = await Menu.countDocuments({}, {hint: "_id_"});;
        if(!length)
        {
            return res.json({status: false,  msg: 'Could not fetch menu right now. Please try again.'});
        }
        return res.json({status: true, length});
    }
    catch(error)
    {
        next(error);
    }
};

const getCartItems = async (req, res, next) => {
    try
    {
        const {userId} = req.params;

        const cart = await Cart.find({userId});
        if(!cart)
        {
            return res.json({status: false,  msg: 'Could not fetch cart items right now. Please try again.'});
        }

        return res.json({status: true, cart});
    }
    catch(error)
    {
        next(error);
    }
};

const increaseCartItem = async (req, res, next) => {
    try
    {
        const {id, userId} = req.params;

        let cartItem = (await Cart.find({userId: userId, _id: id}))[0];

        if(!cartItem)
        {
            // If the cart item doesn't exist, create it
            cartItem = await Cart.create({userId: userId, _id: id, quantity: 1});
        }
        else
        {
            // If the cart item exists, update its quantity
            cartItem = await Cart.findOneAndUpdate(
                {userId, _id: id},
                {$inc: {quantity: 1}}, // Increment the quantity by 1
                {new: true} // Return the updated document
            );
        }
        return res.json({status: true, cartItem});
    }
    catch(error)
    {
        next(error);
    }
};

const decreaseCartItem = async (req, res, next) => {
    try
    {
        const {id, userId} = req.params;
        let cartItem = (await Cart.find({userId: userId, _id: id}))[0];
        
        if(!cartItem)
        {
            return res.json({status: false, msg: 'Cart item not found.'});
        }
        else
        {
            if(cartItem.quantity === 1)
            {
                // If the quantity is 1, delete the cart item
                await Cart.findOneAndDelete({userId: userId, _id: id});
            }
            else
            {
                // Otherwise, decrease the quantity by 1
                cartItem = await Cart.findOneAndUpdate(
                    {userId: userId, _id: id},
                    {$inc: {quantity: -1}}, // Decrement the quantity by 1
                    {new: true}
                );
            }
        }
        return res.json({status: true, cartItem});
    }
    catch(error)
    {
        next(error);
    }
};

const removeCartItem = async (req, res, next) => {
    try
    {
        const {id, userId} = req.params;
        const cartItem = await Cart.findOneAndDelete({userId: userId, _id: id});
        if(cartItem.length === 0)
        {
            return res.json({status: false, msg: 'Cannot remove item from cart. Please try again.'});
        }
        return res.json({status: true});
    }
    catch(error)
    {
        next(error);
    }
};

const removeUserCart = async (req, res, next) => {
    try
    {
        const {userId} = req.params;
        const cartItems = await Cart.deleteMany({userId});
        if(cartItems.length === 0)
        {
            return res.json({status: false, msg: 'Order cannot be placed right now. Please try again.'});
        }
        return res.json({status: true});
    }
    catch(error)
    {
        next(error);
    }
};

const removeMenuItem = async (req, res, next) => {
    try
    {
        const {id} = req.params;
        const menuItem = await Menu.findOneAndDelete({_id: id});
        if(!menuItem)
        {
            return res.json({status: false, msg: 'Cannot remove the particular item from menu. Please try again.'});
        }
        return res.json({status: true});
    }
    catch(error)
    {
        next(error);
    }
};

const addToMenu = async (req, res, next) => {
    try
    {
        const {productName: name, productDescription: description, productCategory: category, productPrice: price, productImage: image} = req.body;
        // console.log(req.body);
        const menuItem = await Menu.create({name, description, category, price, image});
        if(!menuItem)
        {
            return res.json({status: false, msg: 'Cannot add particular item to menu. Please try again.'});
        }
        return res.json({status: true, msg: 'Food Item added successfully'});
    }
    catch(error)
    {
        next(error);
    }
};

const addOrder = async (req, res, next) => {
    try
    {
        const {cart, total, userId, userInfo} = req.body;
        const order = await Order.create({userId, orders: cart, totalPrice: total, userInfo});
        if(!order)
        {
            return res.json({status: false, msg: 'Cannot place order right now. Please try again.'});
        }
        return res.json({status: true, msg: 'Order placed successfully'});
    }
    catch(error)
    {
        next(error);
    }
};

const fetchOrders = async (req, res, next) => {
    try
    {
        const {id: userId} = req.params;
        let orderItems;
        if(!userId) orderItems = await Order.find({});
        else orderItems = await Order.find({userId});
        // const orderItems = await Order.find({userId});
        // console.log(orderItems);
        if(orderItems.length == 0)
        {
            return res.json({status: false, msg: 'Cannot display order history right now. Please try again.'});
        }
        return res.json({status: true, orderItems});
    }
    catch(error)
    {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try
    {
        const {id: _id} = req.params;
        const {value: orderStatus} = req.body;
        // console.log(orderStatus);
        const updatedOrder = await Order.findByIdAndUpdate({_id}, {orderStatus}, {new: true});
        // console.log(updatedOrder);
        if(!updatedOrder)
        {
            return res.json({status: false, msg: 'Cannot update order status right now. Please try again.'});
        }
        return res.json({status: true, updatedOrder});
    }
    catch(error)
    {
        next(error);
    }
};

module.exports = {getMenu, getCartItems, increaseCartItem, decreaseCartItem, removeCartItem, removeUserCart, removeMenuItem, addToMenu, addOrder, fetchOrders, updateOrderStatus};