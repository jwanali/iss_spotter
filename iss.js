const request = require("request");

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      callback(
        Error(`Status Code ${response.statusCode} when fetching IP: ${body}`),
        null
      );
      return;
    }
    const data = JSON.parse(body).ip;

    callback(null, data);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      callback(
        Error(`Status Code ${response.statusCode} when fetching IP: ${body}`),
        null
      );
      return;
    }
    const parsedBody = JSON.parse(body);
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(message, null);
      return;
    }
    const data = {
      latitude: parsedBody.latitude,
      longitude: parsedBody.longitude,
    };
    callback(null, data);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(
    `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,
    (error, response, body) => {
      if (error) return callback(error, null);
      if (response.statusCode !== 200) {
        callback(body, null);
        return;
      }
      const flyOverTimesArray = JSON.parse(body).response;
      callback(null, flyOverTimesArray);
    }
  );
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) return callback(error, null);
      fetchISSFlyOverTimes(coordinates, (error, flyOverTimes) => {
        if (error) return callback(error, null);
        callback(null, flyOverTimes);
      });
    });
  });
};

module.exports = {
  nextISSTimesForMyLocation,
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
};
