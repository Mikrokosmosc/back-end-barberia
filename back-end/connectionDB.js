import mysql from 'mysql2';

export const Connection = mysql.createConnection({
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
});

Connection.connect((err) => {

    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }

    console.log('Conectado a la base de datos MySQL');

});
