const request = require('request');
const Storage = require('../controllers/storage');

const LAPI_KEY = require('../data/config');

const Requester = {
  requestJson: function requestJson(service, requestParams) {
    const requestUrl = this.createModuleUrl(service, requestParams);

    return new Promise((resolve, reject) => {
      request(requestUrl, (error, response, body) => {
        if (error) {
          return reject(error);
        } else if (response.statusCode !== 200) {
          error = new Error(`Unexpected status code: ${response.statusCode}`);
          error.response = response;
          return reject(error);
        }

        const data = JSON.parse(body);

        // LAPI Login validation
        if (data.Comments !== 'Valid login!') {
          // console.warn('Requester.requestUrl: Response is empty or invalid');
          // TODO should display only when ENV==DEBUG
        }

        resolve(data);
      });
    });
  },


  createModuleUrl: function createModuleUrl(service, requestParams) {
    const authObj = {
      apikey: LAPI_KEY,
      token: getUserToken()
    };

    const ivleUrl = `https://ivle.nus.edu.sg/api/Lapi.svc/${service}`;
    const authInfo = `?APIKey=${authObj.apikey}&AuthToken=${authObj.token}`;

    let completeUrl = ivleUrl + authInfo;
    Object.keys(requestParams).forEach((key) => {
      completeUrl += `&${key}=${requestParams[key]}`;
    });
    return completeUrl;
  }
};

const getUserToken = function getUserToken() {
  return Storage.user.get('user.authToken');
};

module.exports = Requester;
