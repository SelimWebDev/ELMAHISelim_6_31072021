const Sauce = require('../models/sauce');
const fs = require('fs');


exports.setLike = (req, res, next) => {
  const userId = req.body.userId
  const like = req.body.like

  if (like == 1){
    Sauce.findOne({_id: req.params.id}).then(
      (sauce) => {
        if (sauce.usersLiked.indexOf(userId) == -1){
          sauce.likes = sauce.likes + 1
          sauce.usersLiked.push(userId)
          if (sauce.usersDisliked.indexOf(userId) != -1){
            const index = sauce.usersDisliked.indexOf(userId)
            sauce.usersDisliked.splice(index, 1)
          }
          res.status(200).json({
            message: "sauce liké !"
          });
        }
      }
    )
    .catch(
      (error) => {
        res.status(400).json({
          error: 'error'
        });
      }
    );
  }

  if (like == -1){
    Sauce.findOne({_id: req.params.id}).then(
      (sauce) => {
        if (sauce.usersDisliked.indexOf(userId) == -1){
          sauce.dislikes = sauce.dislikes + 1
          sauce.usersDisliked.push(userId)
          if (sauce.usersLiked.indexOf(userId) != -1){
            const index = sauce.usersLiked.indexOf(userId)
            sauce.usersLiked.splice(index, 1)
          }
          res.status(200).json({
            message: "sauce Disliké !"
          });
        }
      }
    )
    .catch(
      (error) => {
        res.status(400).json({
          error: 'error'
        });
      }
    );
  }

  if (like == 0){
    Sauce.findOne({_id: req.params.id}).then(
      (sauce) => {
        if (sauce.usersDisliked.indexOf(userId) != -1){
          sauce.dislikes = sauce.dislikes - 1
          const index = sauce.usersDisliked.indexOf(userId)
          sauce.usersDisliked.splice(index, 1)
          res.status(200).json({
            message: "dislike retiré !"
          });
        }
        else if (sauce.usersLiked.indexOf(userId) != -1){
          sauce.likes = sauce.likes - 1
          const index = sauce.usersLiked.indexOf(userId)
          sauce.usersLiked.splice(index, 1)
          res.status(200).json({
            message: "like retiré !"
          });
        }
      }
    )
    .catch(
      (error) => {
        res.status(400).json({
          error: 'error'
        });
      }
    );
  }
}

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  const thing = new Sauce({
    name: sauceObject.name,
    manufacturer: sauceObject.manufacturer,
    description: sauceObject.description,
    mainPepper: sauceObject.mainPepper,
    heat: sauceObject.heat,
    userId: sauceObject.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce créée avec succès!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: 'error'
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};