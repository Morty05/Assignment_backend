const express = require('express');
const router = express.Router();
const Car = require('../models/Car'); 
const authenticateToken=require('../middleware/authenticateToken');



// posting a car
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, tags, images } = req.body;

   
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newCar = new Car({
      title,
      description,
      tags,
      images,
      owner: req.user.id, 
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add car', error: error.message });
  }
});


// router.post('/', async (req, res) => {
//   const { title, description, tags, images } = req.body;
//   try {
//     const newCar = new Car({
//       title,
//       description,
//       tags,
//       images,
//       owner: req.user.id, 
//     });
//     await newCar.save();
//     res.status(201).json({ message: 'Car added successfully', car: newCar });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to add car', error: error.message });
//   }
// });

// Updating a car
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, images } = req.body;

    const updatedCar = await Car.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { title, description, tags, images },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update car', error: error.message });
  }
});
// Deleting a car
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCar = await Car.findOneAndDelete({ _id: id, owner: req.user.id });

    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete car', error: error.message });
  }
});

// Searching cars globally 
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { keyword } = req.query;
    const regex = new RegExp(keyword, 'i');

    const cars = await Car.find({
      $or: [
        { title: regex },
        { description: regex },
        { tags: regex }
      ]
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search cars', error: error.message });
  }
});

module.exports = router;
