const request = require('request');
const Storage = require('../controllers/storage');

const LAPI_KEY = require('../data/config');

var Requester = {
  requestJson: function(service, requestParams) {
    let requestUrl = this.createModuleUrl(service, requestParams);

    return new Promise(function (fulfill, reject) {
      request(requestUrl, function (error, response, body) {
        if (error) {
          return reject(error);
        } else if (response.statusCode !== 200) {
          error = new Error("Unexpected status code: " + response.statusCode);
          error.response = response;
          return reject(error);
        } else {
          let data = JSON.parse(body);

          // LAPI Login validation
          if (data["Comments"] !== "Valid login!") {
            console.error("Requester.requestUrl: Response is empty or invalid");
          }

          fulfill(data);
        }
      });
    });
  },


  createModuleUrl: function(service, requestParams) {
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
};

var getUserToken = function getUserToken() {
  return Storage.userDb.get('user.authToken').value();
}

module.exports = Requester;
