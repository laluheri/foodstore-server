const Tag = require('./model')


async function store(req, res, next) {
    try {
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