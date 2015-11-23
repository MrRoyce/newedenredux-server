'use strict';

const mongoose  = require('mongoose');

const config    = require('./config/config'),
      Character = require('./models/character');

export default function  getEntries(callback) {

    mongoose.connect(config.database);
    mongoose.connection.on('error', function() {
      console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
    });

  Character
    .find({})
    .exec(function(err, characters) {
      callback(err, characters);
    });

}
