var datawrap = require('datawrap');
var request = require('request');
var OsmxmlParser = require('./parse_osmxml.js');
var fs = require('fs');
var osmtogeojson = require('osmtogeojson');
var Stream = require('stream');

var pathToStream = function(osmPath) {
  var type, dataStream = [],
    bounds = {};
  if (typeof osmPath === 'object') {
    if (Array.isArray(osmPath)) {
      bounds.left = osmPath[0];
      bounds.bottom = osmPath[1];
      bounds.right = osmPath[2];
      bounds.top = osmPath[3];
    } else {
      bounds.left = osmPath.left || osmPath.minX;
      bounds.bottom = osmPath.bottom || osmPath.minY;
      bounds.right = osmPath.right || osmPath.maxX;
      bounds.top = osmPath.top || osmPath.maxY;
    }
    bounds.api = osmPath.api || 'http://www.overpass-api.de/api/xapi_meta?';
    osmPath = datawrap.fandlebars('{{api}}map?bbox={{left}},{{bottom}},{{right}},{{top}}', bounds);
  }
  type = osmPath.substr(0, 4);
  if (type === 'http' || type === 'ftp:') {
    dataStream = request(osmPath);
  } else if (type === '<xml' || type === '<?xm') {
    dataStream = new Stream.Readable();
    dataStream._read = function noop() {};
    dataStream.push(osmPath);
    dataStream.push(null);
  } else {
    dataStream = fs.createReadStream(osmPath);
  }
  return dataStream;
};

module.exports = function(osmPath, callback) {
  var dataStream = [], osmxmlParser;
  return new(datawrap.mockingbird(callback))(function(fulfill, reject) {
    osmxmlParser = new OsmxmlParser();
    dataStream = pathToStream(osmPath);

    dataStream
      .on('data', function(chunk) {
        osmxmlParser.write(chunk);
      })
      .on('error', function(e) {
        reject(e);
      })
      .on('end', function() {
        osmxmlParser.end();
        fulfill(osmtogeojson(osmxmlParser.getJSON()));
      });
    dataStream.resume();
  });
};
