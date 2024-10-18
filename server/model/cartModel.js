const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    _id: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Cart', cartSchema);