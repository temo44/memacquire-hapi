const fs = require('fs');
const path = require('path');

module.exports = function (hapiServer) {
  fs
    .readdirSync(__dirname)
    .forEach(function (file) {
      if (file === 'index.js') return;

      console.log(`going to import route file ${file}`);
      var route = require(path.join(__dirname, file));
      hapiServer.route(route);
    });
}
