'use strict';

// require modules
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const CLIENT_URL = process.env.CLIENT_URL;

// use modules
const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);

client.connect();

// middleware components
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('./client'));

// routes
app.get('/', (req, res) => res.send('hello world'));

app.get('/api/v1/books', function(req,res) {
  client.query(`SELECT * FROM books`)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      console.error('no data loaded:',err);
    })
})

// Add books from book.js
app.post('/api/v1/books', function(req,res) {
  client.query(`INSERT INTO books(author, title, isbn, image_url, description)
  VALUES($1, $2, $3, $4, $5);`,
    [ // when we get a post request to API, query DB, dynamically pass values
      req.body.author,
      req.body.title,
      req.body.isbn,
      req.body.image_url,
      req.body.description,
    ],
    function(err) {
      if (err) console.error(err)
    }
  )
    .then(() => res.send('Insert complete'))
})

// Load books from form
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

// get server up and running
app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
})