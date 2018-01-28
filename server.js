'use strict';

const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

const connectionString = process.env.DATABASE_URL;
// const connectionString = 'postgres://localhost:5432/books';
const client = new pg.Client(connectionString);
client.connect();

app.use(cors());
app.use(function(req, res, next) {
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/books', function(req,res) {
  client.query(`SELECT * FROM books`)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      console.error('no data loaded:',err);
    })
})

app.get('/api/v1/books/:id', function(req,res) {
  client.query(`SELECT * FROM books WHERE id = ${req.params.id};`)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      console.error(err);
    })
})

app.post('/api/v1/books', function(req,res) {
  client.query(`INSERT INTO books (author, title, isbn, image_url, description)
  VALUES($1, $2, $3, $4, $5);`,
    [
      req.body.author,
      req.body.title,
      req.body.isbn,
      req.body.image_url,
      req.body.description
    ]
  )
    .then(function(data) {
      console.log('data passed:',data);
      res.send('request complete');
    })
    .catch(function(err) {
      console.error(err);
    })
})

// delete single book
app.delete('/api/v1/books/:id/'), function(req,res) {
  client.query(`SELECT * FROM books WHERE id=${req.params.id}`)
    .then(function(data) {
      res.send(data);
    })
    .catch(function (err) {
      console.error(err);
    })
}

function createTable() {
  client.query(`
    CREATE TABLE IF NOT EXISTS books(
      id SERIAL PRIMARY KEY,
      title VARCHAR(256),
      author VARCHAR(256),
      isbn VARCHAR(256),
      image_url VARCHAR(500),
      description text NOT NULL
    );`
  )
}

createTable();

app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
})