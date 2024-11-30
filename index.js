const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const Brand = require('./models/Brand'); // Assuming this is defined somewhere in your project
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware to parse incoming JSON requests
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/branddb')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Home route to display all brands
app.get('/', async (req, res) => {
    try {
        const brands = await Brand.find();
        res.render('index', { brands });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

// Add a new brand
app.post('/add', async (req, res) => {
    try {
        const newBrand = new Brand({
            name: req.body.name,
            description: req.body.description
        });

        await newBrand.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error adding brand');
    }
});

// Edit brand page -- prepopulate the form with existing data
app.get('/edit/:id', async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).send('Brand not found');
        res.render('edit', { brand });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

// Update brand
app.post('/edit/:id', async (req, res) => {
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating brand');
    }
});

// Delete brand
app.post('/delete/:id', async (req, res) => {
    try {
        await Brand.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting brand');
    }
});

// Start the server
app.listen(port, () => {
    console.log('Server is running at http://localhost:${port}');
});
