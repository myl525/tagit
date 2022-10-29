const express = require('express');
const router = express.Router();

router.get('/videoPlayer', (req, res) => {
    res.render('video-player', {fileURL: req.query.fileURL, fileName: req.query.fileName});
});

module.exports = router;