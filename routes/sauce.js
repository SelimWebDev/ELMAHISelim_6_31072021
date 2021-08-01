const express = require('express');
const router = express.Router();

const tkn = require('../middleware/tkn');
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/sauce');

router.get('/', tkn, sauceCtrl.getAllSauces);
router.get('/:id', tkn, sauceCtrl.getOneSauce);
router.post('/', tkn, multer, sauceCtrl.createSauce);
router.put('/:id', tkn, multer, sauceCtrl.modifySauce);
router.delete('/:id', tkn, sauceCtrl.deleteSauce);
router.post('/:id/like', tkn, sauceCtrl.setLike);

module.exports = router;