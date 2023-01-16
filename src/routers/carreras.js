const express = require('express'); // framework
const router = express.Router();

const pool = require('../database');// Conexion a BD
const { isLoggedIn } = require('../lib/auth');// llamo a mi libreria de autentificacion
const helpers = require('../lib/helpers');// requiero el encriptador 


// http://localhost:4000/carreras/add
router.get('/add', (req, res) => {

    if(req.user.rol==0)
    {
        res.render('carreras/addCarr');
    }else{
        req.flash('error', 'Usuario no autorizado');
        res.redirect('/logout');
    }
    //res.send('form');
});

router.post('/add', async(req, res) => {
    //res.render('carreras/add');
    console.log(req.body);
    const { nombre } = req.body; // objeto body lo transformo a lista
    const newCarrera = {
        nombre
    };
    //console.log(newUser);
    await pool.query('INSERT INTO carrera set ?', [newCarrera]);
    req.flash('success', 'Carrera Guardada Satisfactoriamente');
    res.redirect('/carreras');
});

// http://localhost:4000/carreras
router.get('/', isLoggedIn, async (req, res) => {
    if(req.user.rol==0){
        var carreras = await pool.query('SELECT * FROM carrera ');
    }else{ carreras=""; }   
    //const carreras = await pool.query('SELECT * FROM carrera ');
    res.render('carreras/listCarr', { carreras }); //res.send('ok')
});

router.get('/delete/:id', async (req, res) => {
    if(req.user.rol==0)
    {
        const { id } = req.params;
        await pool.query('DELETE FROM carrera WHERE idCarrera = ?', [id]);
        req.flash('success', 'Carrera Eliminado Exitosamente');
        res.redirect('/carreras');
    }else{
        req.flash('error', 'Usuario no autorizado');
        res.redirect('/logout');
    }
});

router.get('/edit/:id', async (req, res) => {  

    if(req.user.rol==0)
    {
        const { id } = req.params;
        const carreras = await pool.query('SELECT * FROM carrera WHERE idCarrera = ?', [id]);
        console.log(carreras);
        res.render('carreras/editCarr', {carreras: carreras[0]});
    }else{
        req.flash('error', 'Usuario no autorizado');
        res.redirect('/logout');
    }
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre} = req.body; 
    const newCarrera = {
        nombre
    };
    await pool.query('UPDATE carrera set ? WHERE idCarrera = ?', [newCarrera, id]);
    req.flash('success', 'carrera actualizada satisfactoriamente');
    res.redirect('/carreras');
});

module.exports = router;