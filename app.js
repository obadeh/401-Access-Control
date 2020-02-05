'use strict';

// 3rd Party Resources
const express = require('express');
const mongoose = require('mongoose');
// 1st party Resources
const User = require('./users.js');
const basicAuth = require('./basic-auth-middleware.js');
const bearerAuth = require('./bearer-auth-middleware.js');
// const acl = require('./acl-middleware.js');
// const oauth = require('./oauth-middleware.js');

// Prepare the express app
const app = express();
require('dotenv').config();

// database :
// const mongo = require('mongodb').MongoClient

// Start up DB Server
const options = {
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

mongoose.connect(process.env.MONGODB_URI, options);

// const db = client.db('lab-11-db')

// const collection = db.collection('users')

// App Level MW
app.use(express.static('./public'));
app.use(express.json());

// echo '{"username":"obada","password":"12345"}' | http post :3000/signup
app.post('/signup', (req, res) => {
    console.log('req.body : ', req.body);

    new User(req.body).save()
    .then(userIn => {
        console.log('userIn : ', userIn);
      let token = userIn.generateToken(userIn);
      res.status(200).send(token);
    })
    .catch(e => { res.status(403).send("signup fail: username is already exist"); });
});

// http post :3000/signin -a obada:12345
app.post('/signin', basicAuth, (req, res) => {
  res.status(200).send(req.token);
});

// app.get('/oauth', oauth, (req, res) => {
//   res.status(200).send(req.token);
// });

app.get('/users' ,bearerAuth,(req, res) => {
    let user=new User()
    let users= user.findUsers()
    console.log('users : ', userss);
  res.status(200).send('OK!');
});

// app.get('/create', bearerAuth, acl("create"), (req, res) => {
//   res.status(200).send('OK!');
// });

// app.get('/update', bearerAuth, acl("update"), (req, res) => {
//   res.status(200).send('OK!');
// })

// app.get('/delete', bearerAuth, acl("delete"), (req, res) => {
//   res.status(200).send('OK!');
// })

app.listen(3000, () => console.log('server up'));