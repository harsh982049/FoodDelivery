// const Menu = require('../model/menuModel');
// const Cart = require('../model/cartModel');

// const getFoodMenu = async (req, res, next) => {
//     try {
//         const menu = await Menu.find({}).lean();
//         if (!menu || menu.length === 0) {
//             return res.json({ status: false, msg: 'Menu is currently empty.' });
//         }
//         return res.json({ status: true, menu });
//     } catch (error) {
//         next(error);
//     }
// };

// const getCartItems = async (req, res, next) => {
//     try {
//         const cart = await Cart.find({}).lean();
//         return res.json({ status: true, cart });
//     } catch (error) {
//         next(error);
//     }
// };

// const updateCartItem = async (req, res, next) => {
//     try {
//         const { itemId, action } = req.body;
        
//         let cartItem = await Cart.findOne({ _id: itemId });
        
//         if (!cartItem && action === 'increase') {
//             cartItem = await Cart.create({ _id: itemId, quantity: 1 });
//         } else if (cartItem) {
//             if (action === 'increase') {
//                 cartItem.quantity += 1;
//             } else if (action === 'decrease') {
//                 cartItem.quantity = Math.max(cartItem.quantity - 1, 0);
//             }
            
//             if (cartItem.quantity === 0) {
//                 await Cart.findOneAndDelete({ _id: itemId });
//             } else {
//                 await cartItem.save();
//             }
//         }

//         return res.json({ status: true, cartItem });
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = { getFoodMenu, getCartItems, updateCartItem };


const Menu = require('../model/menuModel');
const Cart = require('../model/cartModel');

const getMenu = async (req, res, next) => {
    try
    {
        // console.log("Reached inside controller");
        // console.log(Menu.collection);
        const {sort} = req.query;
        let result = Menu.find({}).lean();
        if(sort)
        {
            result = result.sort(sort);
        }
        const foodItems = await result;
        // const foodItems = await Menu.find({}).lean();
        // if(!foodItems)
        // {
        //     return res.json({status: false,  msg: 'Could not fetch menu right now. Please try again.'});
        // }
        // console.log(foodItems);
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
        // console.log(Menu.collection);
        const length = await Menu.countDocuments({}, {hint: "_id_"});;
        if(!length)
        {
            return res.json({status: false,  msg: 'Could not fetch menu right now. Please try again.'});
        }
        // console.log(foodItems);
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
        console.log("getCartItems");
        // console.log(req.params);
        const {userId} = req.params;
        // console.log(userId);
        let cart = await Cart.find({userId}).lean();
        // console.log(cart);
        cart = cart.sort((a, b) => parseInt(a._id) - parseInt(b._id));
        if(!cart)
        {
            return res.json({status: false,  msg: 'Could not fetch cart items right now. Please try again.'});
        }
        // console.log(cart);
        // cart = await cart.sort({_id: 1});
        // console.log(cart);
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
        console.log('Increase Cart Item');
        // console.log(req.params);
        const {id, userId} = req.params;
        // console.log(id);
        // console.log(id, req.body);
        let cartItem = (await Cart.find({userId: userId, _id: id}))[0];
        // console.log(cartItem.length);
        // const cart = await Cart.find({_id}).lean();

        if(!cartItem)
        {
            // console.log('Cart item does not exist');
            // If the cart item doesn't exist, create it
            cartItem = await Cart.create({userId: userId, _id: id, quantity: 1});
            // console.log(cartItem);
        }
        else
        {
            console.log(cartItem);
            // If the cart item exists, update its quantity
            cartItem = await Cart.findOneAndUpdate(
                {userId, _id: id},
                {$inc: {quantity: 1}}, // Increment the quantity by 1
                {new: true} // Return the updated document
            );
        }
        return res.json({status: true, cartItem});


        // if(!cartItem)
        // {
        //     cartItem = await Cart.create({_id: id, quantity: req.body.quantity});
        //     // return res.json({status: false,  msg: 'Could not update cart right now. Please try again.'});
        // }
        // else
        // {
        //     cartItem = await Cart.findOneAndUpdate({_id: id}, req.body); 
        // }
        // // console.log(cartItem);
        // // console.log(foodItems);
        // return res.json({status: true, cartItem});
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
        // console.log(id);
        let cartItem = (await Cart.find({userId: userId, _id: id}))[0];
        console.log(cartItem);
        
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


        // if(!cartItem)
        // {
        //     // cartItem = await Cart.create({_id: id, quantity: req.body.quantity});
        //     return res.json({status: false,  msg: 'Could not update cart right now. Please try again.'});
        // }
        // else
        // {
        //     if(cartItem.quantity == 1)
        //     {
        //         cartItem = await Cart.findOneAndDelete({_id: id});
        //     }
        //     else
        //     {
        //         cartItem = await Cart.findOneAndUpdate({_id: id}, req.body); 
        //     }    
        // }
        // // console.log(foodItems);
        // return res.json({status: true, cartItem});
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

module.exports = {getMenu, getCartItems, increaseCartItem, decreaseCartItem, removeCartItem, getMenuLength};