var dataWrap = require('datawrap'),
  fs = require('fs'),
  getOsmData = require('./getOsmData');

// To make the db for this function use the following code
// var db = dataWrap({
// 'type': 'spatialite'
// });


module.exports = function(osmData, tableName, defaults) {
  return new dataWrap.Bluebird(function(resolve, reject) {

    var addParams = function(str, p) {
      if (str.substr(0, defaults.fileDesignator.length) === defaults.fileDesignator) {
        str = fs.readFileSync(defaults.rootDirectory + '/' + str.substr(defaults.fileDesignator.length), defaults.fileOptions.encoding);
      }
      return dataWrap.fandlebars(str, p, function(v) {
        return v && v.replace ? v.replace(/(')/g, '$1$1') : v;
      });
    };

    var params = {
      tableName: tableName + '_geoms',
      tagTableName: tableName + '_tags',
    };

    getOsmData(osmData)
      .catch(reject)
      .then(function(d) {
        var queryList = [];
        queryList.push(addParams('file:///createGeomTable.sql', params));
        queryList.push(addParams('file:///createTagsTable.sql', params));
        d.features.map(function(feature) {
          var paramFeature = {};
          for (var item in feature.properties) {
            paramFeature[item] = typeof feature.properties[item] === 'string' ? feature.properties[item] : JSON.stringify(feature.properties[item]);
          }
          paramFeature.type = paramFeature.type.substr(0, 1);
          paramFeature.geometry = JSON.stringify(feature.geometry);
          paramFeature.tableName = params.tableName;
          paramFeature.tagTableName = params.tagTableName;
          queryList.push(addParams('file:///insertGeometry.sql', paramFeature));
        });
        resolve(queryList);
      });
  });
};
