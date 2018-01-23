'use strict';

const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;

const conString = '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./client'));

app.get('/', function (req, res) {
    response.sendFile('./client/index.html');
});

app.listen(PORT, () => {
    console.log(`currently listening on ${PORT}`);
})