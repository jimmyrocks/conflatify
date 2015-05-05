module.exports = function(pattern) {
  //http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  pattern = pattern || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return pattern.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
