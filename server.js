const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

const mysql = require('mysql');
const data = fs.readFileSync('./config.json');
const conf = JSON.parse(data);

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.username,
    password: conf.password,
    port: conf.port,
    database: conf.database
});

connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/customers', (req, res) => {
    setTimeout(function() { console.log("for test") }, 500);
    connection.query(
        'SELECT * FROM CUSTOMERS;',
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});

app.listen(port, () => console.log(`Listening on port ${port}`));