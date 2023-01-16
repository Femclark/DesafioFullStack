const express = require('express'); // framework
const router = express.Router();

const pool = require('../database');// Conexion a BD
const { isLoggedIn } = require('../lib/auth');// llamo a mi libreria de autentificacion
const helpers = require('../lib/helpers');// requiero el encriptador 

// http://localhost:4000/links/add
router.get('/add', async(req, res) => {
    if(req.user.rol==0)
    {
        var carrerasBD = await pool.query('SELECT * FROM carrera');
        res.render('links/add',{carrerasBD});//,
    }else{
        req.flash('error', 'Usuario no autorizado');
        res.redirect('/logout');
    }
    //res.send('form');
});

router.post('/add', async(req, res) => {
    //res.render('links/add');
    console.log('aqui si que si');
    console.log(req.body);
    const { nombre, apellido,carrera, password } = req.body; // objeto body lo transformo a lista
    const newUser = {
        nombre,
        apellido,
        password,
        rol:1, // rol usuario
        idCarrera:carrera,
    };
    //console.log(newUser);
    newUser.password = await helpers.encryptPassword(password);// Encripto la password
    await pool.query('INSERT INTO alumnos set ?', [newUser]); 
    req.flash('success', 'Alumno Guardado Satisfactoriamente');
    res.redirect('/links');
});

// http://localhost:4000/links
router.get('/', isLoggedIn, async (req, res) => {
    //console.log(req.user.rol);
    if(req.user.rol==0){
        var links = await pool.query('SELECT * FROM alumnos ');
    }else{
        var links = await pool.query('SELECT * FROM alumnos WHERE idAlumno = ?', [req.user.idAlumno]);
    }   
    //const links = await pool.query('SELECT * FROM alumnos ');
    res.render('links/list', { links }); //res.send('ok')
});

router.get('/delete/:id', async (req, res) => {
    if(req.user.rol==0)// si es usuario valido
    {
        const { id } = req.params;
        await pool.query('DELETE FROM alumnos WHERE idAlumno = ?', [id]);
        req.flash('success', 'Alumno Eliminado Exitosamente');
        res.redirect('/links');        
    }else{
        req.flash('error', 'Usuario no autorizado');
        res.redirect('/logout');
    }
    //console.log(req.params);
});

router.get('/edit/:id', async (req, res) => {
    if(req.user.rol==0)
    {
        const { id } = req.params;
        const links = await pool.query('SELECT * FROM alumnos WHERE idAlumno = ?', [id]);
        const carreras=await pool.query('SELECT * FROM carrera');
        var filtroCarreras=carreras.filter((item) => item.idCarrera !== links[0].idCarrera);
        var filCarrera=carreras.filter((item) => item.idCarrera === links[0].idCarrera);
        var nameCarrera=filCarrera[0];      
        res.render('links/edit', {link: links[0], nameCarrera,filtroCarreras});
    }else{
        req.flash('error', 'Usuario no autorizado');
        res.redirect('/logout');  
    }
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, carrera} = req.body; 
    const newLink = {
        nombre,
        apellido,
        idCarrera:carrera
    };
    await pool.query('UPDATE alumnos set ? WHERE idAlumno = ?', [newLink, id]);
    req.flash('success', 'alumno actualizado satisfactoriamente');
    res.redirect('/links');
});

module.exports = router;