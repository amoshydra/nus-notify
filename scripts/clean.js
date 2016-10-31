const fs = require('fs');
const p = require("path");

const __rootname = '.';

// Functions
const removeFile = function removeFile(filepath) {
  if (fs.existsSync(filepath)) {
    console.log(`Removing: ${filepath}`);
    fs.unlinkSync(filepath);
  }
}
const removeDirectory = function removeDirectory(filepath) {
  console.log(`Removing: ${filepath}`);
  fs.rmdirSync(path);
}
const removeDirectoryRecurse = function removeDirectoryRecurse(path) {
  if(fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = p.join(path, file);
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        removeDirectoryRecurse(curPath);
      } else { // delete file
        removeFile(curPath);
      }
    });
    removeDirectory(filePath);
  }
};


// Delete user config and data
removeFile(`${__rootname}/data/datadb.json`);
removeFile(`${__rootname}/data/userdb.json`);

// Delete dist folder
removeDirectoryRecurse(`${__rootname}/dist`);

// Finalise
console.log("------------------");
console.log("Cleaning completed");
