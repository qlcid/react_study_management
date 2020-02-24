const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

const mysql = require('mysql');
const data = fs.readFileSync('./config.json');
const conf = JSON.parse(data);

const multer = require('multer');
const upload = multer({ dest: './upload' });

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
    // setTimeout(function() { console.log("for test") }, 500);
    connection.query(
        'SELECT * FROM CUSTOMERS;',
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
    let sql = 'INSERT INTO CUSTOMERS VALUES (null, ?, ?, ?, ?, ?)';
    let image = '/image/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let params = [image, name, birthday, gender, job];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));