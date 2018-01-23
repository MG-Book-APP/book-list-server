'use strict';

// require modules
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors')

// use modules
app.use(cors());
const app = express();
const PORT = process.env.PORT;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);

client.connect();

// middleware components
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('./client'));

// routes
app.get('/', function (req, res) {
  res.send('hello world');
});

// // CRUD applications
// // GET from postgres

// // POST from client to postgres

// // if table has not been created, create one
// function createTable() {
//     client.query(`
//         CREATE TABLE IF NOT EXISTS books(
//             title VARCHAR(255)
//             author VARCHAR(255)
//             url VARCHAR(255)
//         );
//     `)
//     .then(function(response) {
//         console.log('success! created table')
//     })
// }

// createTable();

// get server up and running
app.listen(PORT, () => {
    console.log(`currently listening on ${PORT}`);
})
