const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send('hello word')
    //res.render('index');
});

module.exports = router;