const Category = require('./model');

//store category
async function store(req, res, next) {
    try {
        let payload = req.body
        console.log(payload);
        let category = new Category(payload);

        await category.save();

        res.json(category);
    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.message
            });
        }
        next(err)
    }
}

//update category
async function update(req, res, next) {
    try {
        let payload = req.body
        console.log(payload);
        let category = await Category.findOneAndUpdate({ _id: req.params.id }, payload, { new: true, runValidators: true })

        res.json(category);
    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.message
            });
        }
        next(err)
    }
}

async function destroy(req, res, next) {
    try {
        let deleted = await Category.findOneAndDelete({ _id: req.params.id });

        return res.json(deleted);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    store,
    update,
    destroy
}