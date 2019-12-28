const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    category1: { type: Array, required: true },
    category2: { type: Array, required: true },
    imageLink: { type: String, required: true },
    time: { type: Number, required: true },
    ingredients: { type: Array, required: true },
    instructions: { type: Array, required: true },
    allergy: { type: Number, required: false },
    rating: { type: Number, required: false },
    foodType: { type: Number, required: false }
});

module.exports = mongoose.model('Recipe', recipeSchema);