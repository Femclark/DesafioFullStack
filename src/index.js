const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

const bodyParser = require('body-parser');

// Inicializaciones
const app = express();

// Configuraciones
// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); // solo texto en url
app.use(bodyParser.json()); // uso de json en nuestra web

// Variables Globales
app.use((req, res, next) => {
  //app.locals.message = req.flash('message');
  //app.locals.success = req.flash('success');
  //app.locals.user = req.user;
  next();
});

//rutas
app.use(require('./routers/index')); // la vista que quiero mostrar segun ruta
app.use(require('./routers/authentication'));// autentificaciones
app.use('/links', require('./routers/links'));// mis links que utilizaré 

// Public  (imagenes, css, jS, etc )
app.use(express.static(path.join(__dirname, 'public')));


// Start
app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
  });