const express = require('express');
const { route } = require('.');
const pool = require('../database');
const router = express.Router();

const dbpool=require('../database');

// http://localhost:4000/links/add
router.get('/add', (req, res) => {
    res.render('links/add');
    //res.send('form');
});

router.post('/add', async(req, res) => {
    //res.render('links/add');
    //console.log(req.body);
    const { title, url, description } = req.body; // objeto body lo transformo a lista
    const newLink = {
        nombre:title,
        password:url,
        apellido:description,
        rol:1,
        idCarrera:1
    };
    //await pool.query('INSERT INTO alumnos set ?', [newLink]);
    console.log(newLink);
    res.send('Recivido');
});

module.exports = router;