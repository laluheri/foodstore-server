const Tag = require('./model');

const { policyFor } = require('../policy/index');


async function store(req, res, next) {
    try {

        // ----cek policy -----//
        let policy = policyFor(req.user);

        if (!policy.can('create', 'Tag')) {
            return res.json({
                error: 1,
                message: 'Anda tidak memiliki akses'
            })
        }

        let payload = req.body;

        const tag = new Tag(payload);

        await tag.save();

        return res.json(tag);
    } catch (error) {
        if (error && error.name === "ValidationError") {
            return error.json({
                error: 1,
                message: error.message,
                fields: error.errors
            })
        }
        next(error);
    }
}

async function update(req, res, next) {
    try {
        // ----cek policy -----//
        let policy = policyFor(req.user);

        if (!policy.can('update', 'Tag')) {
            return res.json({
                error: 1,
                message: 'Anda tidak memiliki akses'
            })
        }
        let payload = req.body;

        const tag = await Tag.findOneAndUpdate({ _id: req.params.id }, payload, { new: true, runValidators: true })

        return res.json(tag);
    } catch (error) {
        if (error && error.name === "ValidationError") {
            return error.json({
                error: 1,
                message: error.message,
                fields: error.errors
            })
        }
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        // ----cek policy -----//
        let policy = policyFor(req.user);

        if (!policy.can('delete', 'Tag')) {
            return res.json({
                error: 1,
                message: 'Anda tidak memiliki akses'
            })
        }

        let deleted = await Tag.findOneAndDelete({ _id: req.params.id });

        return res.json(deleted);

    } catch (err) {
        next(err)
    }
}
module.exports = {
    store,
    update,
    destroy,
}