const request = require('request');
const low = require("lowdb");
const userDb = low('./data/userdb.json');
const LAPI_KEY = require('../data/config');

var Requester = function () {};

Requester.prototype.requestJson = function(service, requestParams, callback) {
  let requestUrl = this.createModuleUrl(service, requestParams);

  request(requestUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(JSON.parse(body));
    } else {
      console.log(error);
    }
  });
}

Requester.prototype.createModuleUrl = function(service, requestParams) {
  let authObj = {
    apikey: LAPI_KEY,
    token: getUserToken()
  }
  let ivleUrl = `https://ivle.nus.edu.sg/api/Lapi.svc/${service}`;
  let authInfo = `?APIKey=${authObj.apikey}&AuthToken=${authObj.token}`;

  let completeUrl = ivleUrl + authInfo;
  for (var key in requestParams) {
    completeUrl += `&${key}=${requestParams[key]}`;
  }

  return completeUrl;
}

function getUserToken() {
  return userDb.get('user.authToken').value();
}

module.exports = new Requester();
