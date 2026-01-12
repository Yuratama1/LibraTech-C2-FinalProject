const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql_db', // Nama service di docker-compose
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'userpassword',
    database: process.env.DB_NAME || 'libratech_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database as id ' + connection.threadId);
});

module.exports = connection;