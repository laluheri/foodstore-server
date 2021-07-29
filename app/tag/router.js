const router = require('express').Router();

const multer = require('multer');

const tagController = require('./controller');

router.post('/tags', multer().none(), tagController.store);
router.post('/tags/:id', multer().none(), tagController.update);
router.put('/tags/:id', tagController.destroy);

module.exports = router;