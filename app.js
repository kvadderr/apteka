const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
var mysql = require('mysql');
const bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json()
 

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'apteka'
});

// Log any errors connected to the db
db.connect(function(err){
    if (err) console.log(err)
    
  });
app.use(express.static(__dirname + '/public'));
  
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get("/login", function(request, response){
  
  let data = request.query;
  console.log(data);
  let sql = 'SELECT * FROM pharmacies WHERE login = "'+data.login+'" AND password = "'+data.pass+'"';
  db.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      response.send(result);
      
  });
});


app.get("/pharmData",  function(request, response){
  
  let data = request.query;
  console.log(data);
  let sql = 'SELECT * FROM pharmacies WHERE id_pharmacies = "'+data.id+'"';
  db.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      response.send(result);
      
  });
})

app.get("/stock",  function(request, response){
  let data = request.query;
  console.log(data);
  let sql = 'SELECT stock.id_stock, medecine.name AS medName, category.name AS catName, medecine.price, stock.count, parametr.dosage, form.name FROM stock, category, parametr, medecine, form WHERE stock.id_medecine = medecine.id_medecine AND stock.id_parametr = parametr.id_parametr AND category.id_category = medecine.id_category AND parametr.id_form = form.id_form AND id_pharmacies = "'+data.id+'"';
  db.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      response.send(result);
      
  });
})

app.get("/category", function(request, response) {
  let sql = 'SELECT * FROM category';
  db.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      response.send(result);
      
  });
})

app.get("/form", function(request, response) {
  let sql = 'SELECT * FROM form';
  db.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      response.send(result);
      
  });
})
/*
app.get("/form", function(request, response) {
  let sql = 'SELECT * FROM parametr WHERE id_form = ' + request.query.id;
  db.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      response.send(result);
      
  });
})
*/
app.get("/medecine",  function(request, response){
  
  let data = request.query;
  console.log(data);
  let sql = 'SELECT * FROM medecine';
  db.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      response.send(result);
      
  });
})


app.get("/form",  function(request, response){
  
  let data = request.query;
  console.log(data);
  let sql = 'SELECT * FROM form';
  db.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      response.send(result);
      
  });
})

app.get("/parametr",  function(request, response){
  
  let data = request.query;
  console.log(data);
  let sql = 'SELECT * FROM parametr WHERE id_form = "'+data.id+'"';
  db.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      response.send(result);
      
  });
})

app.post("/deleteStock", jsonParser, (request, response) => {
  
  let data = request.body;
  console.log(data);
  let sql = 'UPDATE stock SET count = count - ' + data.count + ' WHERE id_stock = ' + data.id_stock;

  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
    
});

app.post("/newStock", jsonParser, (request, response) => {
  
  let data = request.body;
  let sqlTwo;
  console.log(data);
  let sql = 'SELECT * FROM stock WHERE id_medecine = "'+data.id_medecine+'" AND id_parametr = "' + data.id_parametr + '" AND id_pharmacies = ' + data.id_pharmacies;

  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    if (result.length > 0 ) {
      sqlTwo = 'UPDATE stock SET count = count + ' + data.count + ' WHERE id_stock = ' + result[0].id_stock;
    } else {
      sqlTwo = 'INSERT INTO stock (id_medecine, id_parametr, count, id_pharmacies) VALUES ('+data.id_medecine+', '+data.id_parametr+', '+ data.count +','+ data.id_pharmacies +' )'
    }
    db.query(sqlTwo, function (err) {
      if (err) return console.error(err.message);  
    });
});

  /*let sql = 'INSERT INTO pharmacies (name, phone, adress, login, password) VALUES ("'+data.name+'", "'+data.phone+'", "'+data.adress+'", "'+data.login+'", "'+data.password+'")';
  db.query(sql, function (err) {
      if (err) return console.error(err.message);  
  });*/
})

app.post("/register", jsonParser, (request, response) => {
  
  let data = request.body;
  console.log(data);
  let sql = 'INSERT INTO pharmacies (name, phone, adress, login, password) VALUES ("'+data.name+'", "'+data.phone+'", "'+data.adress+'", "'+data.login+'", "'+data.password+'")';
  db.query(sql, function (err) {
      if (err) return console.error(err.message);  
  });
})


server.listen(3000, () => {
    console.log('listening on *:3000');
});


