const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orders: {
        type: Array,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        default: 'Food Processing',
        required: true
    },
    userInfo: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);