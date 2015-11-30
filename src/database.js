'use strict';

const mongoose  = require('mongoose'),
      _         = require('lodash'),
      async     = require('async');

const config    = require('./config/config'),
      Character = require('./models/character');

export default function  getEntries(funccb) {

  mongoose.connect(config.database);

  mongoose.connection.on('error', function() {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
  });

  async.parallel([
    function(callback) {
      Character.count({}, function(err, count) {
        callback(err, count);  // totalCount: results[0]
      });
    },
    function(callback) {
      Character.count({ race: 'Amarr' }, function(err, amarrCount) {
        callback(err, amarrCount);  // amarrCount: results[1]
      });
    },
    function(callback) {
      Character.count({ race: 'Caldari' }, function(err, caldariCount) {
        callback(err, caldariCount);  // caldariCount: results[2]
      });
    },
    function(callback) {
      Character.count({ race: 'Gallente' }, function(err, gallenteCount) {
        callback(err, gallenteCount);  // gallenteCount: results[3]
      });
    },
    function(callback) {
      Character.count({ race: 'Minmatar' }, function(err, minmatarCount) {
        callback(err, minmatarCount);  // minmatarCount: results[4]
      });
    },
    function(callback) {
      Character.count({ gender: 'Male' }, function(err, maleCount) {
        callback(err, maleCount);  // maleCount: results[5]
      });
    },
    function(callback) {
      Character.count({ gender: 'Female' }, function(err, femaleCount) {
        callback(err, femaleCount);  // femaleCount: results[6]
      });
    },
    function(callback) {
      Character.aggregate({ $group: { _id: null, total: { $sum: '$wins' } } }, function(err, totalVotes) {
          var total = totalVotes.length ? totalVotes[0].total : 0;
          callback(err, total);  // totalVotes: results[7]
        }
      );
    },
    function(callback) {
      Character
        .find()
        .sort('-wins')
        .limit(100)
        .select('race')
        .exec(function(err, characters) {
          if (err) callback(err);

          var raceCount = _.countBy(characters, function(character) {
            return character.race;
          });
          var max = _.max(raceCount, function(race) {
            return race;
          });
          var inverted = _.invert(raceCount);
          var topRace = inverted[max];
          var topCount = raceCount[topRace];

          callback(err, { race: topRace, count: topCount });  // leadingRace: results[8],
        });
    },
    function(callback) {
      Character
        .find()
        .sort('-wins')
        .limit(100)
        .select('bloodline')
        .exec(function(err, characters) {
          if (err) callback(err);

          var bloodlineCount = _.countBy(characters, function(character) {
            return character.bloodline;
          });
          var max = _.max(bloodlineCount, function(bloodline) {
            return bloodline;
           });
          var inverted = _.invert(bloodlineCount);
          var topBloodline = inverted[max];
          var topCount = bloodlineCount[topBloodline];

          callback(err, { bloodline: topBloodline, count: topCount });  // leadingBloodline: results[9]
        });
    },
    function(callback) {
      Character
        .find()
        .exec(function(err, characters) {
          callback(err, characters);  // characters: results[10]
        });
    }
  ],
  function(err, results) {
    // Callback function with results
    funccb(err, {
      stats :  {
        totalCount       : results[0],
        amarrCount       : results[1],
        caldariCount     : results[2],
        gallenteCount    : results[3],
        minmatarCount    : results[4],
        maleCount        : results[5],
        femaleCount      : results[6],
        totalVotes       : results[7],
        leadingRace      : results[8],
        leadingBloodline : results[9]
      },
      characters       : results[10]
    });
  });

}
