const Sauce = require('../models/sauce');
const fs = require('fs');

exports.setLike = (req, res, next) => {                 // modifier like
  const userId = req.body.userId
  const like = req.body.like
  let totalLikes
  let totalDislikes
  let tabUsersLiked
  let tabUsersDisliked

  Sauce.findOne({_id: req.params.id})                     // on trouve la sauce défini
    .then( (obj) => {
      const sauce = obj;
      totalLikes = sauce.likes
      totalDislikes = sauce.dislikes
      tabUsersLiked = sauce.usersLiked
      tabUsersDisliked = sauce.usersDisliked

      if (like == 1){                                   // si like on met à jour en BDD
        tabUsersLiked.push(userId);                 
        totalLikes += 1;
        Sauce.updateOne(
          { _id: req.params.id },
          { likes: totalLikes, usersLiked: tabUsersLiked }
        )
        .then(() => res.status(200).json({ message: 'like ajouté!'}))
        .catch(error => res.status(400).json({ error }));
      }
    
      if (like == -1){
        tabUsersDisliked.push(userId);
        totalDislikes += 1;
        Sauce.updateOne(
          { _id: req.params.id },
          { dislikes: totalDislikes, usersDisliked: tabUsersDisliked }
        )
        .then(() => res.status(200).json({ message: 'Dislike ajouté !'}))
        .catch(error => res.status(400).json({ error }));
      }
    
      if (like == 0){                                     // si annule like ou dislike
        if (tabUsersLiked.indexOf(userId) != -1){          // si user est dans tabuserliked
          tabUsersLiked.splice(tabUsersLiked.indexOf(userId), 1);   // on le retire du tab en donnant son index a .splice
          totalLikes -= 1;                                            // on update la suite
          Sauce.updateOne(
            { _id: req.params.id },
            { likes: totalLikes, usersLiked: tabUsersLiked}
          )
          .then(() => res.status(200).json({ message: 'like retiré!'}))
          .catch(error => res.status(400).json({ error }));
        }
        else if (tabUsersDisliked.indexOf(userId) != -1){
          tabUsersDisliked.splice(tabUsersDisliked.indexOf(userId), 1);
          totalDislikes -= 1;
          Sauce.updateOne(
            { _id: req.params.id },
            { dislikes: totalDislikes, usersDisliked: tabUsersDisliked}
          )
          .then(() => res.status(200).json({ message: 'Dislike retiré!'}))
          .catch(error => res.status(400).json({ error }));
        }
      }
    })
    .catch( (error) => {
      res.status(400).json({ 
        error: "impossible de retrouver la sauce en base de donné"
      })
    })

}

exports.createSauce = (req, res, next) => {                           // créer une sauce
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
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {       
  console.log('lancement de getonesauce')
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(405).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?                                                        // si il y a un fichier en requete, req sera sous format multipart form data
    {
      ...JSON.parse(req.body.sauce),                                                    // on itère (parse req.sauce)
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`      // sauvegarde req.fichier
    } : { ...req.body };                                                                // sinon on itère le body dans sauceobject
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlinkSync(`images/${filename}`);
    })
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