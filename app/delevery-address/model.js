const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const deleveryAddressSchema = Schema({
    nama: {
        type: String,
        required: [true, 'Nama alamat harus diisi'],
        maxLength: [255, 'Panjang maksimal 255 karakter']
    },
    kelurahan: {
        type: String,
        required: [true, 'kelurahan harus diisi'],
        maxLength: [255, 'Panjang maksimal 255 karakter']
    },
    kecamatan: {
        type: String,
        required: [true, 'kecamatan harus diisi'],
        maxLength: [255, 'Panjang maksimal 255 karakter']
    },
    kabupaten: {
        type: String,
        required: [true, 'kabupaten harus diisi'],
        maxLength: [255, 'Panjang maksimal 255 karakter']
    },
    provinsi: {
        type: String,
        required: [true, 'provinsi harus diisi'],
        maxLength: [255, 'Panjang maksimal 255 karakter']
    },
    detail: {
        type: String,
        required: [true, 'detail harus diisi'],
        maxLength: [1000, 'Panjang maksimal 1000 karakter']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = model('DeleveryAddress', deleveryAddressSchema);