const low = require("lowdb");

var Storage = {
  dataDb: low('./data/datadb.json'),
  userDb: low('./data/userdb.json')
};

module.exports = Storage;
