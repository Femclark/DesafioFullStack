const pool = require('../database');// Conexion a BD
const helpers = require('../lib/helpers');// requiero el encriptador 

//APIS CRUD USUARIOS
const getUsurio = async (req, res) => {
    try {
        let alumnos="";
        
        alumnos = await pool.query('SELECT * FROM alumnos ');
        alumnos=JSON.stringify(alumnos);
        alumnos=JSON.parse(alumnos);
        return alumnos;
    } catch (error) {
        res.status(500);
        res.send(error.message); 
    }
};

const insertUsuario=async(req, res)=>
{
     try {
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
        return true;
    } catch (error) {
        return false;
    }
};

const DeleteUsuario=async(req, res)=>
{
     try {
        const { id } = req.params;
        await pool.query('DELETE FROM alumnos WHERE idAlumno = ?', [id]);
        return true;
    } catch (error) {
        return false;
    }
};


const EditUsuario=async(req, res)=>
{
     try {
        const { id } = req.params;
        const links = await pool.query('SELECT * FROM alumnos WHERE idAlumno = ?', [id]);
        const carreras=await pool.query('SELECT * FROM carrera');
        var filtroCarreras=carreras.filter((item) => item.idCarrera !== links[0].idCarrera);
        var filCarrera=carreras.filter((item) => item.idCarrera === links[0].idCarrera);
        var nameCarrera=filCarrera[0];          
        return [links,nameCarrera,filtroCarreras];
    } catch (error) {
        return false;
    }
};

const GetUsuarioid=async(req, res)=>
{
    //carreras=[];
     try {
        let USUARIO="";
        USUARIO = await pool.query('SELECT * FROM alumnos WHERE idAlumno = ?', [req.user.idAlumno]);
        USUARIO=JSON.stringify(USUARIO);
        USUARIO=JSON.parse(USUARIO);
        return USUARIO;
    } catch (error) {
        return USUARIO;
    }
};

module.exports= {
    methods: {
        getUsurio,
        insertUsuario,
        DeleteUsuario,
        EditUsuario,
        GetUsuarioid
    }
};