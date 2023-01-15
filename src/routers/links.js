const express = require('express'); // framework
const router = express.Router();

const pool = require('../database');// Conexion a BD
const { isLoggedIn } = require('../lib/auth');// llamo a mi libreria de autentificacion

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
        idCarrera:1,
        idAlumnos: req.user.id
    };
    await pool.query('INSERT INTO alumnos set ?', [newLink]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});

// http://localhost:4000/links
router.get('/', isLoggedIn, async (req, res) => {
    //console.log(req.user.rol);
    if(req.user.rol==0){
        console.log('paso por aqui con id y rol admin');
        console.log(req.user.idAlumno)
        console.log(req.user.rol)
        var links = await pool.query('SELECT * FROM alumnos ');
    }else{
        console.log('paso por aqui con id y rol user');
        console.log(req.user.idAlumno)
        console.log(req.user.rol)
        var links = await pool.query('SELECT * FROM alumnos WHERE idAlumno = ?', [req.user.idAlumno]);
    }   
    //const links = await pool.query('SELECT * FROM alumnos ');
    res.render('links/list', { links }); //res.send('ok')
});

router.get('/delete/:id', async (req, res) => {
    //console.log(req.params);
    const { id } = req.params;
    await pool.query('DELETE FROM alumnos WHERE idAlumno = ?', [id]);
    req.flash('success', 'Alumno Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM alumnos WHERE idAlumno = ?', [id]);
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
    await pool.query('UPDATE alumnos set ? WHERE idAlumno = ?', [newLink, id]);
    req.flash('success', 'alumno Updated Successfully');
    res.redirect('/links');
});

module.exports = router;