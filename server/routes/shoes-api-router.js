const express = require('express');
const ShoeModel = require('../models/shoes-model.js');
const router = express.Router();

//GET Route -> localhost:3000/api/shoes
router.get('/shoes', (req, res, next) => {
  ShoeModel.find()
    .limit(20)
    .sort({ _id: -1})
    .exec((err, recentShoes) => {
      if (err) {
        console.log('Error phinding the shoes', err);
        res.status(500).json({ errorMessage: 'Finding your shoes went wrong 💩'});
        return;
      }

      res.status(200).json(recentShoes);
    });
});

//POST Route -> localhost:3000/api/shoes
router.post('/shoes', (req, res, next) => {
  const theShoe = new ShoeModel({
    name: req.body.shoesName,
    brand: req.body.shoesBrand,
    image: req.body.shoesImage
  });

  theShoe.save((err) => {
    if(theShoe.errors) {
      res.status(400).json({
        errorMessage: 'Validation failed 😡',
        validationErrors: theShoe.errors
      });
      return;
    }
    if(err) {
      console.log("Error Posting Shoes", err);
      res.status(500).json({ errorMessage: 'New shoes went wrong 💩'});
      return;
    }
    res.status(200).json(theShoe);
  })
});

// Get Route -> localhost:3000/api/shoes/ID
router.get('/shoes/:shoesId', (req, res, next) => {
  ShoeModel.findById(
    req.params.shoesId,
    (err, phoneFromDb) => {
      if(err) {
        console.log('Shoes details Error', err);
        res.status(500).json({errorMessage: 'Shoes details went wrond 💩'});
        return;
      }
      res.status(200).json(phoneFromDb);
    }
  )
});

//PUT localhost:3000/api/shoes/ID
router.put('/shoes/:shoesId', (req, res, next) => {
  ShoeModel.findById(
    req.params.shoesId,
    (err, shoesFromDb) => {
      if(err) {
        console.log('Shoes Details Error', err);
        res.status(500).json({errorMessage: 'Shoes details went wrong 💩'});
        return;
      }

      shoesFromDb.set({
        name: req.body.shoesName,
        brand: req.body.shoesBrand,
        image: req.body.shoesImage
      });

      shoesFromDb.save((err) => {
        if(shoesFromDb.errors) {
          res.status(400).json({
            errorMessage: 'Update validation failed 🤢',
            validationErrors: shoesFromDb.errors
          });
          return;
        }
        if(err) {
          console.log('Phone update Error', err);
          res.status(500).json({errorMessage: 'Shoe update went wrong 💩'});
          return;
        }
        res.status(200).json(shoesFromDb);
      });
    }
  );
});

// DELETE Route localhost:3000/api/shoes/ID
router.delete('/shoes/:shoesId', (req, res, next) => {
  ShoeModel.findByIdAndRemove(
    req.params.shoesId,
    (err, phoneFromDb) => {
      if(err) {
        console.log('Shoes delete Error', err);
        res.status(500).json({errorMessage: "Shoes deletion went wrong 💩"});
        return;
      }
      res.status(200).json(phoneFromDb);
    }
  )
});

module.exports = router;
