/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const postDb = require('./data/helpers/postDb');
const userDb = require('./data/helpers/userDb');

const server = express();
server.use(express.json(), cors());

server.get('/users', (req, res) => {
  userDb
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err, res.status(500).json({ error: 'Error getting users from database' }));
    });
});

server.get('/users/:id', (req, res) => {
  userDb
    .get(req.params.id)
    .then(user => {
      !user ? res.status(404).json({ message: 'ID not found.' }) : res.status(200).json(user);
    })
    .catch(e => {
      console.log(e);
      res.status(500).json({ error: 'Error accessing database.' });
    });
});

server.post('/users', (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ errorMessage: 'Please provide a name' });
  }

  userDb
    .insert(req.body)
    .then(obj => {
      res.status(200).json({ name: req.body.name });
    })
    .catch(e => {
      console.log(e);
      res.status(500).json({ error: 'Error inserting user into database' });
    });
});

server.delete('/users/:id', (req, res) => {
  userDb
    .get(req.params.id)
    .then(user => {
      !user
        ? res.status(404).json({ message: 'ID not found.' })
        : userDb.remove(req.params.id).then(count => {
            if (count > 0) {
              res.status(200).json({ success: 'User has been deleted.' });
            }
          });
    })
    .catch(e => {
      console.log(e);
      res.status(500).json({ error: 'Error deleting user from the database.' });
    });
});

server.listen(8000, () => {
  console.log('Running on port 8000');
});