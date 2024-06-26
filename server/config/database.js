const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.CONEX, {
    dialect: 'mysql',
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
    define: {
        freezeTableName: true, //Esta opción evita que se busquen las tablas en plural
        timestamps: false //Esta opción evita las columnas createdAt y updatedAt      
    },
    timezone: '-05:00'
});

const dbConnection = async () => {
    try {

        await sequelize.authenticate();
        console.log('Se ha conectado exitosamente a Algoritmo. Felicidades!');

    } catch (error) {

        console.log(error);
        throw new Error('Error al conectar a algoritmo_db');
        //process.exit(1); // detener la app
    }

}

module.exports = {
    sequelize,
    dbConnection
}