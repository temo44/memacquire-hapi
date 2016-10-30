"use strict";

const fs = require('fs');
const path = require('path');

module.exports = function (hapiServer) {
  let traverseDirectory = (dirName) => {
    fs.readdirSync(dirName)
      .forEach((file) => loadRoute(dirName, file));
  }

  let loadRoute = (dirName, file) => {
    let filePath = path.join(dirName, file);
    const fileStats = fs.lstatSync(filePath);

    if(fileStats.isDirectory()) {
      traverseDirectory(filePath);
    }

    if (fileStats.isFile() && filePath.endsWith('route.js')) { 
      console.log(`going to import route file ${file}`);
      require(filePath)(hapiServer);
    }
  };

  traverseDirectory(__dirname);
}
