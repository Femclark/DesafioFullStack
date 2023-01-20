const express = require('express'); // framework
const router = express.Router();

const pool = require('../database');// Conexion a BD
const { isLoggedIn } = require('../lib/auth');// llamo a mi libreria de autentificacion
const helpers = require('../lib/helpers');// requiero el encriptador 

const carrerasController = require('../controller/carreras.controller.js');


//Api
router.get('/listadocarreras',isLoggedIn, carrerasController.methods.getCarreras);// http://localhost:4000/carreras/ListadoCarreras

router.get('/', isLoggedIn, async (req, res) => {
    let carreras=[];
    console.log(req.body); 
    if(req.user.rol==0){
         carreras = await carrerasController.methods.getCarreras(req,res);// llamo al controllador API
    }else{  carreras=""; }  

        res.render('carreras/listCarr', {carreras}  ); //res.send('ok')
});

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

    //console.log(newUser);
    insert = await carrerasController.methods.insertCarrera(req,res);// llamo al controllador API
    if (insert==true){
        req.flash('success', 'Carrera Guardada Satisfactoriamente');
    }else{
        req.flash('error', 'Error al ingresar la carrera');
    }
    res.redirect('/carreras');
});


router.get('/delete/:id', async (req, res) => {
    if(req.user.rol==0)
    {
        borrado = await carrerasController.methods.DeleteCarrera(req,res);// llamo al controllador API
        if(borrado==true){
            req.flash('success', 'Carrera Eliminado Exitosamente');
            res.redirect('/carreras');
        }else{
            req.flash('error', 'Error al borrar bd');
            res.redirect('/carreras');
        }

    }else{
        req.flash('error', 'Usuario no autorizado');
        res.redirect('/logout');
    }
});

router.get('/edit/:id', async (req, res) => {  

    if(req.user.rol==0)
    {
        carreras = await carrerasController.methods.GetCarreraid(req,res);// llamo al controllador API
        res.render('carreras/editCarr', {carreras: carreras[0]});//
    }else{
        req.flash('error', 'Usuario no autorizado');
        res.redirect('/logout');
    }
});

router.post('/edit/:id', async (req, res) => {
    Editado = await carrerasController.methods.EditCarrera(req,res);// llamo al controllador API
    if(Editado==true){
        req.flash('success', 'Carrera editada Exitosamente');
        res.redirect('/carreras');
    }else{
        req.flash('error', 'Error al editada bd');
        res.redirect('/carreras');
    }
});

module.exports = router;