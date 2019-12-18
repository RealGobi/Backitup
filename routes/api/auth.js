const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth =require('../../middleware/auth');


// User Model

const User = require('../../models/User');

// @route POST api/auth
// @desc register auth user
//@access Public

router.post('/', (req, res) => {
    const {email, password } = req.body;
// validation
    if ( !email || !password){
        return res.status(400).json({ msg: 'Fyll i alla fält!'});
    }
    // finns användaren?
    User.findOne({ email })
    .then(user => {
        if(!user) return res.status(400).json({msg:'Användare finns ej!.'});

   
         // validate password

         bcrypt.compare(password, user.password)
         .then(isMatch => {
             if (!isMatch) return res.status(400).json({msg:'Fel användaruppgifter, försök igen.'});

             jwt.sign(
                { id: user.id },
                config.get('jwtSecret'),
                { expiresIn: 3600 },
                (err, token) => {
                    if(err) throw err;
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    })
                }
            )
         }) 
 
         
    })
});


// @route GET api/auth/user
// @desc register auth user
//@access Privet

router.get('/user', auth, (req,res) => {
    User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user))
})

module.exports = router;