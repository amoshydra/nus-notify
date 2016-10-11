const low = require('lowdb');
const JsonWatch = require('jsonwatch');

function StorageFactory(filePath) {
  const jsonWatcher = new JsonWatch(filePath);
  const thisDb = low(filePath);

  return {
    path: filePath,
    get: function get(path) {
      return thisDb.get(path).value();
    },
    set: function set(path, value) {
      return thisDb.set(path, value).value();
    },
    has: function has(path) {
      return thisDb.has(path).value();
    },
    watch: function watch(pathToWatch, callback) {
      jsonWatcher.on('add', (affectedPath, data) => {
        if (affectedPath === pathToWatch) {
          callback(data);
        }
      });
      jsonWatcher.on('cng', (affectedPath, oldData, data) => {
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
