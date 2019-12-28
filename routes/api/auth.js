const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');


// User Model

const User = require('../../models/User');

// @route POST api/auth
// @desc register auth user
//@access All

router.post('/', (req, res) => {
    const {
        email,
        password,
    } = req.body;
    // validation
    if (!email || !password) {
        return res.status(400).json({
            msg: 'Fyll i alla fält!'
        });
    }
    // finns användaren?
    User.findOne({
            email
        })
        .then(user => {
            if (!user) return res.status(400).json({
                msg: 'Användare finns ej!.'
            });


            // validate password

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({
                        msg: 'Fel användaruppgifter, försök igen.'
                    });

                    jwt.sign({
                            id: user.id
                        },
                        process.env.jwt_key, {
                            expiresIn: 3600
                        },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    foodType: user.foodType,
                                    isAdmin: user.isAdmin,
                                }
                            })
                            console.log(user);   
                            
                        }
                    )
                })
        })
});


// @route GET api/auth/user
// @desc register auth user
//@access Auth

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
})


// @route PUT api/users
// @desc change foodtype on user
//@access user


router.get('/user', auth, (req, res) => {
    User.findByIdAndUpdate(req.user.id, req.body).then(function () {
            User.findOne({_id: req.params.id}).then(function(foodType){
            res.send(foodType);
        })
    });
});

module.exports = router;