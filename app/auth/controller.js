const User = require('../user/model');

const passport = require('passport');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const config = require('../config');


async function register(req, res, next) {
    try {
        const payload = req.body;

        let user = new User(payload);

        await user.save();

        return res.json(user);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err)
    }
}

async function localStrategy(email, password, done) {
    try {
        let user = await User
            .findOne({ email })
            .select('-__v -createdAt -updatedAt -cart_items -token');
        console.log("user", user);
        if (!user) return done();

        if (bcrypt.compareSync(password, user.password)) {
            ({ password, ...userWithoutPassword } = user.toJSON());

            return done(null, userWithoutPassword);
        }
    } catch (err) {
        done(err, null)
    }
    done();
}

async function login(req, res, next) {
    passport.authenticate('local', async function(err, user) {
        console.log(req.body);
        if (err) return next(err);

        if (!user) return res.json({ error: 1, message: 'email or password incorrect' });

        let signed = jwt.sign(user, config.secretKey);

        await User.findOneAndUpdate({ _id: user._id }, { $push: { token: signed } }, { new: true });

        return res.json({
            message: 'logged in successfully',
            user: user,
            token: signed
        });

    })(req, res, next);
}

function me(req, res, next) {

    if (!req.user) {
        return res.json({
            error: 1,
            message: `You're not login or token expired`
        });
    }
    return res.json("req.user");

}

module.exports = {
    register,
    localStrategy,
    login,
    me,
}