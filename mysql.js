const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'changeSeats',
    password: 'password',
    database: 'changeseatsdb'
});

connection.connect(function (err) {
    if (err){
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

connection.query('select * from test', function(err, rows, fields) {
    if (err) {
        console.log('error: ' + err);
    }

    for (row of rows){
        console.log('name: ' + row.name + ', birthday: ' + row.id);
    }
});

connection.end();