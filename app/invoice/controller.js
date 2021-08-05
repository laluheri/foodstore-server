const { subject } = require('@casl/ability');
const { policy, policyFor } = require('../policy');
const Invoice = require('./model');

async function show(req, res, next) {
    try {

        let { order_id } = req.params;

        let invoice = await Invoice
            .findOne({ order: order_id })
            .populate('order')
            .populate('user');

        let policy = policyFor(req.user);

        let subjectInvoice = subject('Invoce', {...invoice, user_id: invoice.user._id });

        if (!policy.cam('read', subjectInvoice)) {
            return res.json({
                error: 1,
                message: `Anda tidak memiliki akses melihat invoice ini`
            });
        }
        return res.json(invoice);
    } catch (err) {
        return res.json({
            error: 1,
            message: `Error when getting invoice`
        });
    }
}

module.exports = {
    show,
}