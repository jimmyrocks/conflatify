module.exports = function(presets, tagTableName, onlySearchable) {
  var uninterestingKeys = [
    'name',
    'created_by',
  ];
  var mapGeometryTypes = function(type) {
    var translations = {
      'point': 'POINT',
      'vertex': 'POINT',
      'line': 'LINESTRING',
      'area': 'POLYGON'
    };
    return translations[type];
  };
  var interestingTags = [];
  for (var preset in presets) {
    // Internal NPS Editor uses the searchable tag to determine if the tag is useful to us
    if (presets[preset].searchable === true || !onlySearchable) {
      for (var tag in presets[preset].tags) {
        for (var geometry in presets[preset].geometry) {
          if (uninterestingKeys.indexOf(tag.split(':')[0]) < 0) {
            interestingTags.push({
              'k': tag,
              'v': presets[preset].tags[tag],
              'geometryType': mapGeometryTypes(presets[preset].geometry[geometry])
            });
          }
        }
      }
    }
  }
  return interestingTags;
};
