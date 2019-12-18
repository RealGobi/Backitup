const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Recipe Model
const Recipe = require('../../models/Recipe');

// @route   GET api/Recipe
// @desc    Get All Recipe
// @access  Public
router.get('/', (req, res) => {
  Recipe.find()
    .sort({ date: -1 })
    .then(recipe => res.json(recipe));
});

// @route   POST api/Recipe
// @desc    Create An Recipe
// @access  Private
router.post('/', auth, (req, res) => {
  const newItem = new Recipe({
    name: req.body.name,
    info: req.body.info
  });

  newItem.save().then(recipe => res.json(recipe));
});

// @route   DELETE api/recipe/:id
// @desc    Delete A recipe
// @access  Private
router.delete('/:id', auth, (req, res) => {
  Recipe.findById(req.params.id)
    .then(recipe => recipe.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
