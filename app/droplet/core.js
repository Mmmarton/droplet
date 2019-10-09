const droplet = (function(global) {
  var droplet = {
    version: '0.0.1'
  };
  global.droplet = droplet;
  return droplet;
})(typeof window === 'undefined' ? global : window);

export default droplet;
