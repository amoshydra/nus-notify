const low = require('lowdb');

const Storage = {
  dataDb: low('./data/datadb.json'),
  userDb: low('./data/userdb.json')
};

module.exports = Storage;
