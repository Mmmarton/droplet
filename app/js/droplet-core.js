(function(global) {
  var droplet = {
    version: '0.0.1'
  };

  if (global.droplet) {
    throw new Error('The library was already imported.');
  } else {
    global.droplet = droplet;
  }
})(typeof window === 'undefined' ? this : window);
