var buildInserts = require('./src/buildInserts');
var datawrap = require('datawrap');
var datawrapDefaults = require('./defaults');

var defaults = datawrap.fandlebars.obj(datawrapDefaults, global.process);

// Set up a db in memory for this
var db = datawrap({
  'type': 'spatialite'
}, defaults);

var taskList = [{
  'name': 'input insert list',
  'task': buildInserts,
  'params': ['./osm/edison_buildings.osm', 'input', defaults]
}, {
  'name': 'insert inserts to db',
  'task': db.runQuery,
  'params': ['{{input insert list}}']
}, {
  'name': 'Get bounds for input',
  'task': db.runQuery,
  'params': ['file:///getMbrs.sql', {
    tableName: 'input'
  }]
}, {
  'name': 'osm data insert list',
  'task': function(a, b, c) {
    var newA = './osm/example_download.osm'; // Dev, so we don't hit the server constantly
    return buildInserts(newA, b, c);
  },
  'params': ['{{Get bounds for input}}', 'osm', defaults]
}, {
  'name': 'insert inserts to db',
  'task': db.runQuery,
  'params': ['{{osm data insert list}}']
}, {
  'name': 'Get bounds for input',
  'task': db.runQuery,
  'params': ['file:///getMbrs.sql', {
    tableName: 'osm'
  }]
}];

datawrap.runList(taskList, 'Main Task')
  .then(function(a) {
    console.log('ok');
    console.log(a[a.length - 1]);
  }).catch(function(e) {
    console.log('err', e);
    // throw e;
  });
