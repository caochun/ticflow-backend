var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: './public/uploads/' });

router.post('/', upload.single('photo'), function (req, res, next) {
    res.status(200).json({filename: req.file.filename});
});

module.exports = router;