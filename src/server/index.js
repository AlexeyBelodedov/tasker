const dotenv = require('dotenv').config({path:__dirname+'/./../../.env'});
const express = require('express');
const mysql = require("mysql");
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.BACKEND_PORT;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

function fsError(error) {
    fs.appendFileSync(__dirname + '/debug.log', `\n${error}`);
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/task/create', function(req, res) {
    let insertQuery = `INSERT INTO task (projectName, taskName) VALUES ('${req.body.projectName}', '${req.body.taskName[0]}')`;
    connection.query(insertQuery, function(error, result) {
        if (error) {
            fsError(error);
            return;
        }
        res.json(result.insertId);
    });
});

app.post('/task/getAllTasks', function(req, res) {
    let query = `SELECT * FROM \`task\` ORDER BY id DESC LIMIT 6`;
    connection.query(query, function(error, results, fields) {
        if (error) {
            fsError(error);
            return;
        }
        res.json(JSON.stringify(results));
    });
});

app.post('/task/editTask', function(req, res) {
    let id = req.body.id;
    let projectName = req.body.projectName;
    let taskName = req.body.taskName;
    let query = '';
    if (projectName) {
        query = `UPDATE \`task\` SET \`projectName\` = '${projectName}' WHERE id = ${id}`;
    } else if (taskName) {
        query = `UPDATE \`task\` SET \`taskName\` = '${taskName}' WHERE id = ${id}`;
    } else {
        res.json('ok');
    }
    fsError(query);
    connection.connect();
    connection.query(query, function(error, results, fields) {
        if (error) {
            fsError('error: ' + error);
            return;
        }
        res.json(JSON.stringify(results));
    });
    connection.end();
});


app.post('/task/deleteTask', function(req, res) {
    let id = req.body.id;
    let query = `DELETE FROM \`task\` WHERE id = ${id}`;
    connection.query(query, function(error, results, fields) {
        if (error) {
            fsError('error: ' + error);
            return;
        }
        res.json(JSON.stringify(results));
    });
});

app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`)
});

module.exports = app;