const express = require('express'); // framework
const router = express.Router();

const pool = require('../database');// Conexion a BD
const { isLoggedIn } = require('../lib/auth');// llamo a mi libreria de autentificacion
const helpers = require('../lib/helpers');// requiero el encriptador 

const usuariosController = require('../controller/usuarios.controller.js');//Api
const carrerasController = require('../controller/carreras.controller.js');//Api

// http://localhost:4000/links/add
router.get('/add', async(req, res) => {
    if(req.user.rol==0)
    {
        carrerasBD = await carrerasController.methods.getCarreras(req,res);// llamo al controllador API
        res.render('links/add',{carrerasBD});//,
    }else{
        req.flash('error', 'Usuario no autorizado');
        res.redirect('/profile');
    }
    //res.send('form');
});

router.post('/add', async(req, res) => {
    insertado = await usuariosController.methods.insertUsuario(req,res);// llamo al controllador API
    if(insertado==true){
        req.flash('success', 'Alumno Guardado Satisfactoriamente');
    }else{
        req.flash('error', 'Error al Guardado Alumno');
    }
    
    res.redirect('/links');
});

// http://localhost:4000/links
router.get('/', isLoggedIn, async (req, res) => {
    //console.log(req.user.rol);
    if(req.user.rol==0){
        var links = await usuariosController.methods.getUsurio(req,res);// llamo al controllador API
    }else{
        var links =  await usuariosController.methods.GetUsuarioid(req,res);// llamo al controllador API
    }   
    //const links = await pool.query('SELECT * FROM alumnos ');
    res.render('links/list', { links }); //res.send('ok')
});

router.get('/delete/:id', async (req, res) => {
    if(req.user.rol==0)// si es usuario valido
    {
        borrado = await usuariosController.methods.DeleteUsuario(req,res);// llamo al controllador API
        if(borrado==true){
            req.flash('success', 'Alumno Eliminado Exitosamente');
        }else{
            req.flash('error', 'Error al Eliminar Alumno');
        }       
        res.redirect('/links');        
    }else{
        req.flash('error', 'Usuario no autorizado');
        res.redirect('/profile');
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