const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://masterp6:wordpassp6@cluster0.ck76z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,                                
    useUnifiedTopology: true })                                           // connexion à la base de donné
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {                                     // set header des requetes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());              
                                          
app.use('/images', express.static(path.join(__dirname, 'images')));     // route de sauvegarde des images
app.use('/api/auth', userRoutes);                                     // route 
app.use('/api/sauces', sauceRoutes);

app.use(function(req, res, next) {                                    // handler url sauvage
  res.status(404).json('La page spécifié est inaccessible')
  next()
});

module.exports = app;