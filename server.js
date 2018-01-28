'use strict';

const cors = require('cors');
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/books', function(req,res) {
  client.query(`SELECT * FROM books`)
    .then(function(data) {
      console.log('get all books route hit')
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

app.delete('/api/v1/books/:id', function(req,res) {
  console.log(req.params.id)
  client.query(`DELETE FROM books WHERE id = ${req.params.id};`)
    .then(() => {
      res.send('Book deleted');
    })
    .catch(function (err) {
      console.error(err);
    })
});

// Doesn't work as of Sunday, January 28.
app.put('/api/v1/books/:id/:edit', function(req,res) {
  console.log('Server',req.body)
  client.query(`UPDATE * FROM WHERE id = ${req.params.id};`)
    .then(() => {
      client.query(`
      UPDATE books
      SET title=$1,
          author=$2,
          isbn=$3,
          image_url=$4,
          description=$5
      WHERE id = $6;
      `,
        [
          req.body.title,
          req.body.author,
          req.body.isbn,
          req.body.image_url,
          req.body.description,
          req.params.id
        ]
      )
    })
    .then(() => res.send('Book has been updated.'))
    .catch(function (err) {
      console.error(err);
    })
});

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