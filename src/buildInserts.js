var dataWrap = require('datawrap'),
  getOsmData = require('./getOsmData');

// To make the db for this function use the following code
// var db = dataWrap({
// 'type': 'spatialite'
// });

var addParams = function(str, p) {
  return dataWrap.fandlebars(str, p, function(v) {
    return v && v.replace ? v.replace(/(')/g, '$1$1') : v;
  });
};

module.exports = function(osmData, tableName) {
  return new dataWrap.Bluebird(function(resolve, reject) {
    var params = {
      tableName: tableName + '_geoms',
      tagTableName: tableName + '_tags',
    };

    getOsmData(osmData)
      .catch(reject)
      .then(function(d) {
        var queryList = [];
        queryList.push(addParams('CREATE TABLE {{tableName}} (osmid BIGINT, type CHAR, meta TEXT, the_geom GEOMETRY)', params));
        queryList.push(addParams('CREATE TABLE {{tagTableName}} (osmid BIGINT, k TEXT, v TEXT)', params));
        d.features.map(function(feature) {
          var paramFeature = {};
          for (var item in feature.properties) {
            paramFeature[item] = typeof feature.properties[item] === 'string' ? feature.properties[item] : JSON.stringify(feature.properties[item]);
          }
          paramFeature.type = paramFeature.type.substr(0, 1);
          paramFeature.geometry = JSON.stringify(feature.geometry);
          queryList.push(
            addParams('INSERT INTO {{tableName}} VALUES ', params) +
            addParams('({{id}}, \'{{type}}\', \'{{meta}}\', GeomFromGeoJSON(\'{{geometry}}\'));', paramFeature));
        });
        resolve(queryList);
      });
  });
};
