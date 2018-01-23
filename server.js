'use strict';

const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors')
app.use(cors());
const app = express();
const PORT = process.env.PORT;

const connectionString = process.env.DATABASE_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('./client'));

app.get('/test', function (req, res) {
    response.send('hello world');
});

app.listen(PORT, () => {
    console.log(`currently listening on ${PORT}`);
})