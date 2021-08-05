const router = require('express').Router();

const multer = require('multer');

const addressController = require('./controller');

router.post('/delevery-address', multer().none(), addressController.store);
router.put('/delevery-address/:id', multer().none(), addressController.update);
router.delete('/delevery-address/:id', addressController.destroy);
router.get('/delevery-address', addressController.index);

module.exports = router;