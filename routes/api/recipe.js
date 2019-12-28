const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Recipe Model
const Recipe = require('../../models/recipes');
const mongoose = require('mongoose');

// @route   GET api/Recipe
// @desc    Get All Recipe
// @access  All

router.get('/', (req, res) => {
  Recipe.find()
    .then(recipe => res.json(recipe));
});

// @route   POST api/Recipe
// @desc    Create An Recipe
// @access  Auth
router.post('/', auth, (req, res) => {
  const newItem = new Recipe({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    category1: req.body.category1,
    category2: req.body.category2,
    imageLink: req.body.imageLink,
    time: req.body.time,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    allergy: req.body.allergy,
    rating: req.body.rating,
    foodType: req.body.foodType,
  });

  newItem.save().then(recipe => res.json(recipe));
});

// @route   DELETE api/recipe/:id
// @desc    Delete A recipe
// @access  Auth

router.delete('/:id', auth, (req, res) => {
  Recipe.findById(req.params.id)
    .then(recipe => recipe.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});


// @route   PATCH api/Recipe
// @desc    Edit An Recipe
// @access  Auth

router.put('/:id', auth, (req, res) => {
  Recipe.findById(req.params.id)
    .then(recipe => recipe.put().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});


module.exports = router;
