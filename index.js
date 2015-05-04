var buildInserts = require('./src/buildInserts');
var datawrap = require('datawrap');

// Set up a db in memory for this
var db = datawrap({
  'type': 'spatialite'
});
var taskList = [{
  'name': 'input insert list',
  'task': buildInserts,
  'params': ['./osm/edison_buildings.osm', 'input']
}, {
  'name': 'insert inserts to db',
  'task': db.runQuery,
  'params': ['{{input insert list}}']
}, {
  'name': 'Get bounds for input',
  'task': db.runQuery,
  'params': ['SELECT MbrMinX(all_geoms) AS left, MbrMinY(all_geoms) AS bottom, MbrMaxX(all_geoms) AS right, MbrMaxY(all_geoms) as top FROM (SELECT ST_UNION(the_geom) AS all_geoms FROM input_geoms)']
}, {
  'name': 'osm data insert list',
  'task': function(a, b) {
    return buildInserts(/*a[0][0]*/'./osm/example_download.osm', b);
  },
  'params': ['{{Get bounds for input}}', 'osm']
}];

datawrap.runList(taskList).catch(function(e) {
  console.log('err', e);
}).then(function(a) {
  console.log(a[a.length - 1]);
});
