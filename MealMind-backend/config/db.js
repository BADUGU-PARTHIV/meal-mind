const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '..', '.env'),
    quiet: true
});
const mysql = require('mysql2');
const requiredVariables = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVariables = requiredVariables.filter((name) => process.env[name] === undefined);
if (missingVariables.length > 0) {
    throw new Error(`Missing database configuration: ${missingVariables.join(', ')}`);
}
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
const connectDatabase = () => new Promise((resolve, reject) => {
    connection.connect((error) => {
        if (error) {
            reject(error);
            return;
        }

        resolve();
    });
});
module.exports = connection;
module.exports.connectDatabase = connectDatabase;
