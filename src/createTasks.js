/*jshint camelcase: false */

var datawrap = require('datawrap');
var createUuid = require('./createUuid');

var TaskTemplate = function() {
  return {
    'geometries': {
      'type': 'FeatureCollection',
      'features': []
    },
    'identifier': '',
    'instruction': ''
  };
};

var createTask = function(instruction, newGeometry, osmGeometry) {
  var task = new TaskTemplate();
  // The unique identifier can be any string of 72 characters or less.
  // A Uuid is 36 chars, so we can use two of them (36+36=72)
  task.identifier = createUuid() + createUuid();
  task.instruction = instruction;
  if (osmGeometry) task.geometries.features.push(osmGeometry);
  if (newGeometry) task.geometries.features.push(newGeometry);
  return task;
};

module.exports = function() {
  console.log(arguments);
  var dbResults = [];
  // Allow multiple arrays to be pushed in and have them all merged into dbResults
  var mergeResults = function(arr) {
    arr.map(function(a) {
      dbResults.push(a);
    });
  };
  for (var arg in arguments) {
    if (Array.isArray(arguments[arg])) {
      mergeResults(arguments[arg]);
    }
  }
  var taskList = [];
  return new datawrap.Bluebird(function(fulfill, reject) {
    taskList = dbResults.map(function(row) {
      var instruction, newGeometry, osmGeometry, newTags = {};
      // Create the message
      instruction = (row.new_id && row.osm_id) ?
        'This object overlaps an existing object. Do they represent the same thing? Which one is better?' :
        'This object appears to be new. Verify that it is correct before adding it to the map';
      // parse the new geometries

      try {
        if (row.new_geom) {
          row.new_keys.split('<f2e7651932b5400eb3ed2b358ae00767>').map(function(k, i) {
            newTags[k] = row.new_values.split('<f2e7651932b5400eb3ed2b358ae00767>')[i];
          });

          newGeometry = {
            'type': 'Feature',
            'properties': newTags,
            'geometry': JSON.parse(row.new_geom)
          };
        }
      } catch (e) {
        reject(e);
      }
      // parse the osm geometries
      try {
        if (row.osm_id) {
          osmGeometry = {
            'type': 'Feature',
            'properties': {
              'osmid': row.osm_id
            },
            'geometry': JSON.parse(row.osm_geom)
          };
        }
      } catch (e) {
        reject(e);
      }
      return createTask(instruction, newGeometry, osmGeometry);
    });
    fulfill(taskList);
  });
};

/*var test = function(d) {
  module.exports(d)
    .catch(function(e) {
      console.log('There was an error');
      throw e;
    })
    .then(function(r) {
      console.log(JSON.stringify(r, null, 2));
    });
};

test(require('../osm/matchJson'));*/
