const fs = require('fs');
const path = require('path');

const Product = require('./model'); //-> model product
const Category = require('../category/model') //-> model Category
const Tag = require('../tag/model')

const config = require('../config')

const { policyFor } = require('../policy');

// fungsi index untu list data
async function index(req, res, next) {

    try {
        let { limit = 10, skip = 0, q = '', category = '', tags = [] } = req.query;

        let criteria = {}

        if (q.length) {
            criteria = {...criteria, name: { $regex: `${q}`, $options: 'i' } }
        }
        if (category.length) {
            category = await Category.findOne({ name: { $regex: `$${category}`, $options: 'i' } });
            if (category) {
                criteria = {...criteria, category: category._id }
            }
        }
        if (tags && tags.length) {
            tags = await Tag.find({ name: { $in: tags } });
            criteria = {...criteria, tags: { $in: tags.map(tag => tag._id) } }
        }

        let count = await Product.find(criteria).countDocuments();

        let product = await Product
            .find(criteria)
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('category')
            .populate('tags')
            .select('__v')

        return res.json({
            data: product,
            count
        });

    } catch (error) {
        next(error)
    }
}

//buat function store
async function store(req, res, next) {

    try {
        // ----cek policy -----//
        let policy = policyFor(req.user);

        if (!policy.can('create', 'Product')) {
            return res.json({
                error: 1,
                message: 'Anda tidak memiliki akses'
            })
        }

        let payload = req.body;

        //relasi dengan category mengambil id berdasarkan pencarian nama
        if (payload.category) {
            let category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });

            if (category) {
                payload = {...payload, category: category._id };
            } else {
                delete payload.category
            }
        }

        if (payload.tags && payload.tags.length) {
            let tags = await Tag.find({ name: { $in: payload.tags } });
            if (tags.length) {
                payload = {...payload, tags: tags.map(tag => tag._id) }
            }
        }
        //cek apakah ada file yang di upload
        if (req.file) {
            // menangkap lokasi sementara 
            let tmp_path = req.file.path;

            // menangkap ekstensi file
            let splitExt = req.file.originalname.split('.')
            let originalExt = splitExt[splitExt.length - 1]

            //membuat nama baru sesuai dengan ekstensi aslinya 
            let filename = req.file.filename + '.' + originalExt;

            // tempat penyimpnana file yang di upload
            let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest)

            src.on('end', async() => {
                try {
                    let product = new Product({...payload, image_url: filename });
                    await product.save();
                    return res.json(product);
                } catch (error) {
                    fs.unlinkSync(target_path);
                    if (error && error.name === "ValidationError") {
                        return res.json({
                            error: 1,
                            message: error.message,
                            fields: error.errors
                        })
                    }
                    next(error)
                }
            })

        } else {
            //buat product menggunakan data payload
            let product = new Product(payload);
            await product.save();

            //memberikan response kepada client 
            return res.json({
                status: "success",
                message: "Produk berhasil di tambahkan",
                data: product
            })
        }


    } catch (err) {
        console.log(err.name);
        //---------cek tipe error ------------
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: {
                    name: {
                        properties: {
                            message: "Nama makanan harus diisi",
                            type: "required",
                            path: "name"
                        },
                        kind: "required",
                        path: "name"
                    }
                }
            })
        }
        next(err)
    }
}

//buat function update
async function update(req, res, next) {

    try {
        // ----cek policy -----//
        let policy = policyFor(req.user);

        if (!policy.can('update', 'Product')) {
            return res.json({
                error: 1,
                message: 'Anda tidak memiliki akses'
            })
        }
        let payload = req.body;

        if (payload.category) {
            let category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });

            if (category) {
                payload = {...payload, category: category._id };
            } else {
                delete payload.category
            }
        }

        if (payload.tags && payload.tags.length) {
            let tags = await Tag.find({ name: { $in: payload.tags } });
            if (tags.length) {
                payload = {...payload, tags: tags.map(tag => tag._id) }
            }
        }


        //cek apakah ada file yang di upload
        if (req.file) {
            // menangkap lokasi sementara 
            let tmp_path = req.file.path;

            // menangkap ekstensi file
            let splitExt = req.file.originalname.split('.')
            let originalExt = splitExt[splitExt.length - 1]

            //membuat nama baru sesuai dengan ekstensi aslinya 
            let filename = req.file.filename + '.' + originalExt;

            // tempat penyimpnana file yang di upload
            let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest)

            src.on('end', async() => {
                try {
                    //cek jika file gambar ada 
                    // let product = new Product({...payload, image_url: filename });
                    // await product.save();
                    // return res.json(product);
                    let product = await Product.findOne({ _id: req.params.id });
                    let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
                    if (fs.existsSync(currentImage)) {
                        //hapus jika ada
                        fs.unlinkSync(currentImage);
                    }
                    product = await Product.findOneAndUpdate({ _id: req.params.id }, payload, { new: true, runValidator: true })
                    return res.json(product)
                } catch (error) {
                    fs.unlinkSync(target_path);
                    if (error && error.name === "ValidationError") {
                        return res.json({
                            error: 1,
                            message: error.message,
                            fields: error.errors
                        })
                    }
                    next(error)
                }
            })

        } else {
            //buat product menggunakan data payload

            //update product ke mongoDB
            let product = await Product.findOneAndUpdate({ _id: req.params.id }, payload, { new: true, runValidator: true })

            //memberikan response kepada client 
            return res.json({
                status: "success",
                message: "Produk berhasil di tambahkan",
                data: product
            })
        }


    } catch (err) {
        console.log(err.name);
        //---------cek tipe error ------------
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: {
                    name: {
                        properties: {
                            message: "Nama makanan harus diisi",
                            type: "required",
                            path: "name"
                        },
                        kind: "required",
                        path: "name"
                    }
                }
            })
        }
        next(err)
    }
}

//function distroy
async function distroy(req, res, next) {
    try {
        // ----cek policy -----//
        let policy = policyFor(req.user);

        if (!policy.can('delete', 'Product')) {
            return res.json({
                error: 1,
                message: 'Anda tidak memiliki akses'
            })
        }

        let product = await Product.findOneAndDelete({ _id: req.params.id });
        console.log(product);
        let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

        if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
        }
        return res.json(product);
    } catch (error) {
        next(error)
    }
}


module.exports = {
    index,
    store,
    update,
    distroy,
}