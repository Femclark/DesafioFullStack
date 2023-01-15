const express = require('express');
const router = express.Router();

const passport = require('passport');//biblioteca
const { isLoggedIn } = require('../lib/auth');

// SIGNUP Registro super Usuario o alumno
router.get('/signup', (req, res) => {
  res.render('auth/signup'); // Envío a layauts 
});

router.post('/signup', (req, res, next) => {
  req.check('nombre', 'Username is Required').notEmpty();
  req.check('apellido', 'apellido is Required').notEmpty();
  req.check('tipoUser', 'tipo Usario is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signup');
  }
  passport.authenticate('local.signup', { // desde passport .js realizo la insercion
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  })(req, res, next);
});

// SINGIN Inicio de Usuario
router.get('/signin', (req, res) => {
  res.render('auth/signin'); //Redirecionar al template
});

router.post('/signin', (req, res, next) => {
  req.check('nombre', 'usuario es requerido').notEmpty();
  req.check('password', 'ususrio es requerido').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
  //res.send('good'); // si respondio serialize 
  console.log(res.body);
  res.render('profile');// redirigo a profile
});

router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
      res.redirect('/');
  });
});

module.exports = router;