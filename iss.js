const request = require("request");

const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json',(error,response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);      
      return;
    }
    const data = JSON.stringify(JSON.parse(body).ip);

    callback(null, data);
  })
};

module.exports = { fetchMyIP };