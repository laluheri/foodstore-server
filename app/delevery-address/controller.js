const DeleveryAddress = require('./model');

const { policyFor } = require('../policy/index');

const { subject } = require('@casl/ability');

async function store(req, res, next) {
    let policy = policyFor(req.user);

    if (!policy.can('create', 'DeleveryAddress')) {
        return res.json({
            error: 1,
            message: `You're not allowed to perform this action`
        });
    }

    try {
        let payload = req.body;
        let user = req.user;

        let address = new DeleveryAddress({...payload, user: user._id });

        await address.save()
        return res.json(address);
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

async function update(req, res, next) {
    let policy = policyFor(req.user);

    try {
        let { id } = req.params;
        let { _id, ...payload } = req.body;

        let address = await DeleveryAddress.findOne({ _id: id });
        let subjectAdress = subject('DeleveryAddress', {...address, user_id: address.user });

        if (!policy.can('update', subjectAdress)) {
            return res.json({
                error: 1,
                message: `You're not allowed to modify this resource`
            })
        }

        address = await DeleveryAddress.findOneAndUpdate({ _id: id }, payload, { new: true });
        return res.json(address);
    } catch (err) {
        if (err && err.name == 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

async function destroy(req, res, next) {
    let policy = policyFor(req.user);

    try {
        let { id } = req.params;

        let address = await DeleveryAddress.findOne({ _id: id });

        let subjectAddress = subject('DeleveryAddress', {...address, user_id: address.user });

        if (!policy.can('delete', subjectAddress)) {
            return res.json({
                error: 1,
                message: `You're not allowed to delete this resource`
            });
        }

        await DeleveryAddress.findOneAndDelete({ _id: id })

        return res.json({
            status: 'success',
            message: 'Data berhasil di hapus',
            data: address
        })
    } catch (err) {
        if (err && err.name == 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors

            })
        }
        next(err)
    }
}

async function index(req, res, next) {
    const policy = policyFor(req.user);
    console.log(req.user._id);
    if (!policy.can('view', 'DeleveryAddress')) {
        return res.json({
            error: 1,
            message: `Your're not allowed to perform this action`
        });
    }
    try {
        let { limit = 10, skip = 0 } = req.query;
        const count = await DeleveryAddress.find({ user: req.user._id }).countDocuments();
        const deliveryAddresses = await DeleveryAddress
            .find({ user: req.user._id })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort('-createdAt')

        return res.json({
            data: deliveryAddresses,
            count: count
        });

    } catch (err) {
        if (err && err.name == 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err)
    }
}

module.exports = {
    store,
    update,
    destroy,
    index
}