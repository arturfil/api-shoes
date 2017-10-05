const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shoeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'What are the shoes name?']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  }
});

const ShoeModel = mongoose.model('Shoe', shoeSchema);

module.exports = ShoeModel;
