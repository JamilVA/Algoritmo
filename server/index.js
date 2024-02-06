const express = require('express'); //de esta forma se importa en node

require('dotenv').config();
const { dbConnection } = require('./config/database');
const cors = require('cors');

//Creando el servidor express
const app = express({origin: true, credentials: true});

//Configuracion de CORS
app.use(cors()); 

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    next();
})

//Lectura y parseo del body
app.use(express.json());

//Conexion a la BD
dbConnection();

app.use('/api/estudiante', require('./routes/estudiante.route'));
// app.use('/api/docente', require('./routes/docante.route'));

//Para levantar el servidor
app.listen(process.env.PORT, () => {
    console.log('Server running on port ' + process.env.PORT)
})

