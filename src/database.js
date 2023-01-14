const mysql = require('mysql');
const { promisify }= require('util'); // transformo un callback a promesa

const { database } = require('./keys'); // archivo de credenciales bd

const pool = mysql.createPool(database);// create pool genera hilos de conexion

pool.getConnection((err, connection) => { // pool tiene la conexion para llamarla desde otros lados
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Revisa las credenciales de conexion de la BD en src/keys');
    }
  }

  if (connection) connection.release(); // si tengo conexion, ok
    console.log('DB is Connected');

  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;