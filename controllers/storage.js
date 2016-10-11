const low = require('lowdb');
const JsonWatch = require('jsonwatch');

function StorageFactory(filePath) {
  return {
    path: filePath,
    db: low(filePath),
    jsonWatch: new JsonWatch(filePath),
    watchPath: function watchPath(pathToWatch, callback) {
      this.jsonWatch.on('add', (affectedPath, data) => {
        if (affectedPath === pathToWatch) {
          callback(data);
        }
      });
      this.jsonWatch.on('cng', (affectedPath, oldData, data) => {
        if (affectedPath === pathToWatch) {
          callback(data);
        }
      });
    }
  };
}

const Storage = {
  data: new StorageFactory('./data/datadb.json'),
  user: new StorageFactory('./data/userdb.json')
};

module.exports = Storage;
