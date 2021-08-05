const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
    name: {
        type: String,
        maxlength: [5, 'Panjang nama makanan 50 karakter '],
        required: true
    },
    qty: {
        type: Number,
        required: [true, 'Qty Harus diisi'],
        min: [1, 'minimal qty adalah 1']
    },
    price: {
        type: Number,
        default: 0
    },
    image_url: { type: String },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
});

module.exports = model('CartItem', cartItemSchema);