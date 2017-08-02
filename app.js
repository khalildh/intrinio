const express = require('express');
const app = express();
const intrinio = require('./intrinio.js');
app.set("view engine", "ejs");

const sql = require('mssql');

const config = {
  user: 'SA',
  password: 'Apathy95',
  server: 'localhost',
  database: 'IntrinioDB'
};


app.get("/", function(req, res) {
  res.render("home");
});


app.get("/company", function(req, res) {
  var query = req.query.search;
  //console.log(query);
  var companyQuery;

  if (query) {
      intrinio.getCompany(query[0], function(par) {
        companyQuery = par;
        intrinio.getDataPoint(query[0], query[1], function(par2){
          var data = par2
          sql.connect(config, function(err) {
            if (err) console.log(err);


            var request = new sql.Request();

            //CREATE TABLE Requests (id INT NOT NULL IDENTITY(1,1), CONSTRAINT PK_id PRIMARY KEY CLUSTERED (id), ticker NVARCHAR(50), tag NVARCHAR(50), response NVARCHAR(50), time NVARCHAR(50))
            //INSERT INTO APIData VALUES ('AAPL', 'low_price', 'null', 'null');

            console.log(data)
            var ticker = "'" +  data.ticker + "'";
            var tag = "'" + data.tag + "'";
            var response = "'" + data.response + "'";
            var time = "'" + data.time + "'";
            var row = "INSERT INTO APIData VALUES ("+ ticker + ", " + tag + ", " + response + ", " + time + ");";
            console.log(row);
            request.query(row, function(err, item){
                if (err) {
                  console.log(err);
                } else {
                  //res.send(item);
                  //console.log(item);
                  sql.close();
                }
            });
          });

          res.render("company", {"company": companyQuery, "data": data})
        });

      });
  } else {
    res.render("company", {"company": false});
  }
//res.send("hello");
});


app.get("/index", function(req, res){
  sql.connect(config, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    //CREATE TABLE Requests (id INT NOT NULL, CONSTRAINT PK_id PRIMARY KEY CLUSTERED (id), ticker NVARCHAR(50), tag NVARCHAR(50), response NVARCHAR(50), time NVARCHAR(50))

    request.query('SELECT * FROM APIData', function(err, item){
        if (err) {
          console.log(err);
        } else {
          //res.send(item);
          //console.log(item);
          res.render("index", {"item": item});
          sql.close();
        }
    });
  });
});

app.get("/company/:id", function(req, res){
  var ticker = req.params.id

  intrinio.getCompanyByID(ticker, function(par) {

    res.render("companyID", {"company": par});
  });
});

const server = 8000;
app.listen(server, function(){
  console.log("Intrinio Server");
});
