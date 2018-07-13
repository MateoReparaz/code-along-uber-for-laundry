
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/user');

const dbName = "mongodb://localhost/uber-for-loundry";
mongoose.connect(dbName);

const Users = [
  {
    username: 'Ojete',
    email: 'Ojete@ojete.com',
    password: 123,
    isLaunderer: true,
    fee: 10
  },
  {
    username: 'Boris',
    email: 'Boris@boris.com',
    password: 123,
    isLaunderer: false,
    fee: null
  },
  {
    username: 'Chomin',
    email: 'Chomin@chomin.com',
    password: 123,
    isLaunderer: false,
    fee: null
  }
]

User.collection.drop();

User.create(Users)
  .then((data)=>{
    console.log(`Created ${data.length} Users`)
    mongoose.disconnect();
  })
  .catch((err) =>{
    console.log(err)
  });
