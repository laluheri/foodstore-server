const { AbilityBuilder, Ability } = require("@casl/ability");

const policies = {
    guest(user, { can }) {
        can('read', 'Product');
    },

    user(user, { can }) {
        // membaca daftar order
        can('view', 'Order');

        // membuat order
        can('create', 'Order');

        // membaca order miliknya
        can('read', 'Order', { user_id: user.user_id });

        // mengupdate data diri sendiri (User)
        can('update', 'User', { _id: user._id });

        //membaca cart miliknya
        can('read', 'Cart', { user_id: user.user_id });

        // mengupdate cart miliknya
        can('update', 'Cart', { user_id: user._id });

        // melihat daftar delevery address
        can('view', 'DeleveryAddress', { user_id: user._id });

        //membuat deleveryAddress
        can('create', 'DeleveryAddress', { user_id: user._id });

        // membaca delevery
        can('read', 'DeleveryAddress', { user_id: user._id });

        // update delevery
        can('update', 'DeleveryAddress', { user_id: user._id });

        // hapus delevery
        can('delete', 'DeleveryAddress', { user_id: user._id });

        //membaca invoice
        can('read', 'Invoice', { user_id: user._id });

    },

    admin(user, { can }) {
        can('manage', all);
    }
}

function policyFor(user) {
    let builder = new AbilityBuilder();

    if (user && typeof policies[user.role] === 'function') {
        policies[user.role](user, builder);
    }

    return new Ability(builder.rules);
}

module.exports = {
    policyFor,
}