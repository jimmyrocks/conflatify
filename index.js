var buildInserts = require('./src/buildInserts');
var datawrap = require('datawrap');
var datawrapDefaults = require('./defaults');
var getTagBoundsFromOverpass = require('./src/getTagBoundsFromOverpass');

var defaults = datawrap.fandlebars.obj(datawrapDefaults, global.process);

// Set up a db in memory for this
var db = datawrap({
  'type': 'spatialite'
}, defaults);

var taskList = [{
  'name': 'initialize database',
  'task': db.runQuery,
  'params': ['file:///initializeDb.sql']
}, {
  'name': 'input insert list',
  'task': buildInserts,
  // TODO: Take this as an input!
  'params': ['./osm/grant_village.osm', 'input', defaults]
}, {
  'name': 'insert inserts to db',
  'task': db.runQuery,
  'params': ['{{input insert list}}']
}, {
  'name': 'tagBounds',
  'task': db.runQuery,
  'params': ['file:///getTagBounds.sql', {
    tableName: 'input_geoms',
    tagTableName: 'input_tags'
  }]
}, {
  'name': 'OverpassData',
  'task': getTagBoundsFromOverpass,
  'params': ['{{tagBounds}}']
}, {
  'name': 'osmInsertList',
  'task': buildInserts,
  'params': ['{{OverpassData}}', 'osm', defaults]
}, {
  'name': 'insert inserts to db',
  'task': db.runQuery,
  'params': ['{{osmInsertList}}']
}, {
  'name': 'Get Overlaps',
  'task': db.runQuery,
  'params': ['file:///getPolygonOverlaps.sql', {
    tableNameA: 'input_geoms',
    tagTableNameA: 'input_tags',
    tableNameB: 'osm_geoms'
  }]
}];

datawrap.runList(taskList, 'Main Task')
  .then(function(a) {
    console.log('ok');
    console.log(JSON.stringify(a[a.length - 1]));
  }).catch(function(e) {
    throw e;
  });
