const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");


// User Model

const User = require('../../models/User');

// @route POST api/users
// @desc register new user
//@access All

router.post('/', (req, res) => {
    const { name, email, password, foodType } = req.body;

    //  validation
    if (!name || !email || !password || !foodType) {
        return res.status(400).json({ msg: 'Fyll i alla fält.' });
    }
    // finns användaren?
    User.findOne({ email })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'Användare redan registrerad.' });

            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                name,
                email,
                password,
                foodType
            })
            // salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {

                            jwt.sign(
                                {
                                    id: user.id
                                },
                                process.env.jwt_key,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id: user._id,
                                            name: user.name,
                                            email: user.email,
                                            foodType: user.foodType,
                                        }
                                    })
                                }
                            )

                        })
                })
            })
        })
});


// @route PUT api/users
// @desc change foodtype on user
//@access user

router.put('/', (req, res) => {
    (User.findAndUpdate({ _id: req.body._id }), req.body)
});


module.exports = router;