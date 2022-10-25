const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index.js');

router.get('/', (req, res) => {
	res.render('index');
});

// apis
router.get('/api/searchDir', controllers.searchDirectory);
router.get('/api/getDir', controllers.getDirectory);
router.post('/api/addDir', controllers.addDirectory);

router.post('/api/addFiles', controllers.addFiles);
module.exports = router;