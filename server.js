'use strict';

const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// test
// app.get('/', (req, res) => res.send('hello world'));

// show all books
app.get('/api/v1/books', function(req,res) {
  client.query(`SELECT * FROM books`)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      console.error('no data loaded:',err);
    })
})

// Load books from book form
app.post('/api/v1/books', function(req,res) {
  client.query(`INSERT INTO books(author, title, isbn, image_url, description)
  VALUES($1, $2, $3, $4, $5);`,
    [ // when we get a post request to API, query DB, dynamically pass values
      req.body.author,
      req.body.title,
      req.body.isbn,
      req.body.image_url,
      req.body.description,
    ]
  )
    .then(function(data) {
      console.log('data passed:',data);
      res.redirect('/')
    })
})

// load single book
app.get('/api/v1/books/:id/'), function(req,res) {
  client.query(`SELECT * FROM books WHERE id=${req.params.id}`)
    .then(function(data) {
      res.send(data);
    })
    .catch(function (err) {
      console.error(err);
    })
}

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
  .then(function(res) {
    console.log('books table are done');
  });
};

createTable();

app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
})