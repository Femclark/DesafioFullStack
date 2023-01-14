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

// http://localhost:4000/links
router.get('/', async (req, res) => {
    //const links = await pool.query('SELECT * FROM alumnos WHERE user_id = ?', [req.user.id]);
    const links = await pool.query('SELECT * FROM alumnos ');
    //console.log(links)
    //res.send('ok')
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    //console.log(req.params);
    const { id } = req.params;
    await pool.query('DELETE FROM alumnos WHERE ID = ?', [id]);
    req.flash('success', 'Alumno Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM alumnos WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE alumnos set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'alumno Updated Successfully');
    res.redirect('/links');
});

module.exports = router;