const https = require('https');
var username = "58862f76a1a3288a603a76bc73864e57";
var password = "1aec039955c7fec53e887fb7f670e98b";
var auth = "Basic " + new Buffer(username + ':' + password).toString('base64');

exports.getCompany = function(ticker, newFunc) {
  var company;
  pathURL = "/companies?ticker=" + ticker;

  var request = https.request({
  method: "GET",
  host: "api.intrinio.com",
  path: pathURL,
  headers: {
    "Authorization": auth
  }
  }, function(response){
    var json = "";
    response.on("data", function(chunk){
      json += chunk;

    });
    response.on("end", function(callback) {
      company = JSON.parse(json);
      newFunc(company);
      //console.log(callback);

    });
  });

  request.end();

}

exports.getDataPoint = function(ticker, item, newFunc) {
  var company;
  pathURL = "/data_point?identifier=" + ticker + "&item=" + item;
  console.log(pathURL);
  var request = https.request({
  method: "GET",
  host: "api.intrinio.com",
  path: pathURL,
  headers: {
    "Authorization": auth
  }
  }, function(response){
    var json = "";
    response.on("data", function(chunk){
      json += chunk;
    });
    response.on("end", function(callback) {
      data = JSON.parse(json);
      //console.log(data);
      var object = {
        "ticker": data.identifier,
        "tag": data.item,
        "response": data.value,
        "time": new Date().toLocaleString().replace(",", " :")
      }
      //console.log(object);
      newFunc(object);
      //console.log(callback);
      //INSERT INTO APIData VALUES ('AAPL', 'low_price', 'null', 'null');


    });
  });

  request.end();

}

exports.getCompanyByID = function(ticker, newFunc){
  var company;

  pathURL = "/data_point?identifier=" + ticker + "&item=bid_price,high_price,low_price,adj_volume,ticker,exchange_name,industry_group,sector,marketcap,security_name,dividend,long_description";
  //console.log(pathURL);
  var request = https.request({
  method: "GET",
  host: "api.intrinio.com",
  path: pathURL,
  headers: {
    "Authorization": auth
  }
  }, function(response){
    var json = "";
    response.on("data", function(chunk){
      json += chunk;
    });
    response.on("end", function(callback) {
      data = JSON.parse(json);
      //console.log(data);
      var object = {}
      //console.log(object);
      data["data"].forEach(function(dataPoint){
        //console.log(dataPoint);
        var item = dataPoint.item;
        var value = dataPoint.value;
        object[item] = value;
      });
      //console.log(object);

      newFunc(object);
    });
  });

  request.end();
}
