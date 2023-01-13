const express = require('express');
const morgan = require('morgan');

// Inicializaciones
const app = express();

// Configuraciones
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev'));

// Variables Globales


//rutas
app.use(require('./routers/index'))
// Public

// Start
app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
  });