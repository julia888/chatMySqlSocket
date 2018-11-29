const express = require('express');
const http = require('http');
const path = require('path');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

const db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: "chatdb"
};

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config);
    connection.connect(function (err) {
        if (err) {
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
    console.log('db connected');
}

handleDisconnect();

connection.query('CREATE DATABASE IF NOT EXISTS chatdb', function (err) {
    if (err) throw err;
    connection.query('USE chatdb', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS users('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'username VARCHAR(30),'
            + 'password VARCHAR(30)'
            + ')', function (err) {
            if (err) throw err;
        });
        // console.log("Table created");
    });
    // console.log("Database created");
});

app.post('/all', function (req, res) {
    res.send('dddd');
});

app.post('/registration', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", '*');
    const username = req.body.username;
    const password = req.body.password;
    connection.query('SELECT * FROM users WHERE username=?', [username], function (err, result) {
        if (err) throw err;
        console.log(result.length);
        if (result.length) {

            return res.status(400).send({error: {message: "Login is already exists!"}});
        } else {
            const sql = "INSERT INTO users (username, password) VALUES ?";
            const values = [
                [username, password]
            ];
            connection.query(sql, [values], function (err, result) {
                if (err) throw err;
                return res.send({success: {message: "You reg!"}});
                // console.log("user inserted");
            });
        }
    });
});

app.post('/login', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", '*');
    const username = req.body.username;
    const password = req.body.password;
    connection.query('SELECT * FROM users WHERE username=?', [username], function (err, result) {
        if (err) throw err;
        // console.log(result[0]);
        // console.log(result.length);
        if (result.length !== 0) {
            if (result[0].password !== password) {
                 res.status(400).send({error:{message: 'Wrong password'}});
            }else {
               return res.send({success: {message: "You login!"}});

            }
        } else {
            return res.send({errorNull:{ message: "User is not in the database!"}});
        }
    });
});

app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.status(404).send('Ресурс не найден');
});
const server = http.createServer(app);
server.listen(8089, () => {
    console.log('server start on http://localhost:8089');
});