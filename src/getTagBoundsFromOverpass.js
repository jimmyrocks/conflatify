var fs = require('fs');
var fandlebars = require('datawrap').fandlebars;
var getOsmdata = require('./getOsmData');

var buildOverpassQuery = function(tagPairBounds) {
  var requestList = '';
  tagPairBounds.map(function(tagPair) {
    tagPair.tagPair = '"' + tagPair.k + '"' + (tagPair.v === '*' ? '' : '="' + tagPair.v + '"');
    requestList += '\n' + fandlebars(fs.readFileSync('./sql/overpass-requests.overpassql', 'utf8'), tagPair);
  });
  return fandlebars(fs.readFileSync('./sql/overpass-query.overpassql', 'utf8'), {
    requestList: requestList
  });
};

module.exports = function(tagPairBounds) {
  return getOsmdata('http://overpass-api.de/api/interpreter', buildOverpassQuery(tagPairBounds[0]));
};
