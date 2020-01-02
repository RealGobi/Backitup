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
    if (!name || !email|| !password || !foodType) {
        return res.status(400).json({ msg: 'Fyll i alla fält.' });
    }

    // email validation 
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }

      function validate() {
        if (validateEmail(email)) {
            return;
        } else {
            return res.status(400).json({ msg: 'Fyll i gilltlig e-post.'})
    }
}
      validate(); 

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


module.exports = router;