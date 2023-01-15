CREATE DATABASE AlumnosCarrera;

USE AlumnosCarrera;

-- TABLE USER
CREATE TABLE Alumnos (
  idAlumno INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  rol INT(1) NOT NULL,
  idCarrera INT 
);

DESCRIBE Alumnos

-- TABLE CARRERA
CREATE TABLE Carrera (
  idCarrera INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(16) NOT NULL
);

DESCRIBE Carrera

-- TABLE RELACION USUARIO CARRERA
CREATE TABLE AlumnoCarrera (
  idAlumno INT(11) NOT NULL ,
  idCarrera INT(11) NOT NULL ,
  ingreso int(4) NOT NULL,
  estado int(1) NOT NULL
);

DESCRIBE AlumnoCarrera

