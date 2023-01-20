const pool = require('../database');// Conexion a BD

//APIS CRUD CARRERAS
const getCarreras = async (req, res) => {
    try {
        let carreras="";
        
        carreras = await pool.query('SELECT * FROM carrera ');
        carreras=JSON.stringify(carreras);
        carreras=JSON.parse(carreras);
        return carreras;
    } catch (error) {
        res.status(500);
        res.send(error.message); 
    }
};

const insertCarrera=async(req, res)=>
{
     try {
        const { nombre } = req.body; // objeto body lo transformo a lista
        const newCarrera = {
            nombre
        };        
        await pool.query('INSERT INTO carrera set ?', [newCarrera]);
        return true;
    } catch (error) {
        return false;
    }
};

const DeleteCarrera=async(req, res)=>
{
     try {
        console.log(req.body)
        const { id } = req.params;
        await pool.query('DELETE FROM carrera WHERE idCarrera = ?', [id]);
        return true;
    } catch (error) {
        return false;
    }
};


const EditCarrera=async(req, res)=>
{
     try {
        const { id } = req.params;
        const { nombre} = req.body; 
        const newCarrera = {
            nombre
        };
        await pool.query('UPDATE carrera set ? WHERE idCarrera = ?', [newCarrera, id]);
        return true;
    } catch (error) {
        return false;
    }
};

const GetCarreraid=async(req, res)=>
{
    //carreras=[];
     try {
        const { id } = req.params;
        let carreras="";
        carreras = await pool.query('SELECT * FROM carrera WHERE idCarrera = ?', [id]);
        carreras=JSON.stringify(carreras);
        carreras=JSON.parse(carreras);
        return carreras;
    } catch (error) {
        return carreras;
    }
};

module.exports= {
    methods: {
        getCarreras,
        insertCarrera,
        DeleteCarrera,
        EditCarrera,
        GetCarreraid
    }
};