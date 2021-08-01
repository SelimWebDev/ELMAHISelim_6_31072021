const express = require('express');
const router = express.Router();

const tkn = require('../middleware/tkn');
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/sauce');

router.get('/', tkn, sauceCtrl.getAllSauces);
router.get('/:id', tkn, sauceCtrl.getOneSauce);
router.post('/', tkn, multer, sauceCtrl.createSauce); ///////////// badd request 400
//router.put('/:id', auth, sauceCtrl.modifySauce);
//router.delete('/:id', auth, sauceCtrl.deleteSauce);
//router.post('/:id/like', auth, sauceCtrl.setLike);

module.exports = router;