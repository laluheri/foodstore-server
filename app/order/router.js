const router = require('express').Router();
const multer = require('multer');

const orderController = require('./controller');

router.post('/orders', multer().none(), orderController.store);
router.get('/oders', orderController.index);

module.exports = router;