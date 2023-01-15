const express = require('express');
const morgan = require('morgan'); // controlador de las peticiones http
const path = require('path'); // ruta de mi proyecto
const exphbs = require('express-handlebars'); // plantillas hbs
const session = require('express-session'); // manejo de sessiones
const validator = require('express-validator'); // validador del ingreso del usuario
const passport = require('passport'); // para validar autentificacion de usuario en la session
const flash = require('connect-flash'); // mensajes flash error
const MySQLStore = require('express-mysql-session')(session); // para almacenar session en bd
const bodyParser = require('body-parser');

const { database } = require('./keys'); // conexion bd para que guarde en session

// Inicializaciones
const app = express();
require('./lib/passport'); // requiero desde archivo passport la autentificacion


// Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views/'));
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',        // layout principal
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
app.use(session({
  secret: 'FernandoMellaClark',
  resave: false, // no renovar sesion
  saveUninitialized: false, // no se volver a iniciar session
  store: new MySQLStore(database) //donde guardaré mi session (en mi bd)
}));

app.use(flash());
app.use(passport.initialize()); // inicialize el pasaport
app.use(passport.session());    // guardelo en session
app.use(validator());

// Variables Globales
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
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