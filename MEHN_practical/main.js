var express = require('express');
var path = require('path');
var util=require('util');
var fs=require('fs');
var expressValidator = require('express-validator');
var app = express();
app.use(expressValidator());
//app.use(express.static('public'));


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/gamma";


//Bodey Parser Middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// View Engine
var exphbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');
//end view Engine for handlebars

var server = app.listen(5055, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})



app.get('/:id', function(req,res){
	fs.readFile( __dirname + "/" + "users.json", 'utf8',function (err, data) {
		usersNew = JSON.parse( data );
		user=usersNew["user"+req.params.id];
       console.log( user );
       res.end( JSON.stringify(user) );
   });
})

app.get('/', function (req, res) {
  var result = [];
   MongoClient.connect(url, function(err, db) {
     if (err) throw err;
        var cursor =db.collection('mehn').find({});
        cursor.forEach(function(doc, err) {
         result.push(doc);
         }, function() {
           db.close();
           res.render('home', {dataset: result});
         });
     });

})
app.post('/data', function(req,res){
    req.checkBody('studentname', 'Student name cannot be empty').notEmpty();
    req.checkBody('college', 'College name cannot be empty').notEmpty();
    req.checkBody('address', 'Address field cannot be empty').notEmpty();
    req.checkBody('age', 'Age field cannot be empty').notEmpty();
    req.checkBody('phone', 'Phone filed cannot be empty').notEmpty();
    req.checkBody('status', 'Status field cannot be empty').notEmpty();

    const errors = req.validationErrors();
    if(errors){
    res.render('home', {errors:errors});
  }else{
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var myobj = {
      StudentName: req.body.studentname,
      College: req.body.college,
      Address:req.body.address,
      Age:req.body.age,
      Phone:req.body.phone,
      Status:req.body.status
    }
       db.collection("mehn").insertOne(myobj, function(err, doc) {
      if (err) {
          throw err;
      }
      else{
      res.redirect('/');
      }

      });
    });

  }

});
app .post('/update', function(req,res){
  req.checkBody('newstudentname', 'Student name cannot be empty').notEmpty();
  req.checkBody('newstatus', 'Status field cannot be empty').notEmpty();
  const errors = req.validationErrors();
  if(errors){
  res.render('home', {errors:errors});
}else{
  MongoClient.connect(url, function(err,db) {

  if (err) throw err;

  var myQuery= {"StudentName":req.body.newstudentname};
  var newValues={$set:{"Status":req.body.newstatus}};
  db.collection('mehn').update(myQuery,newValues);
  res.redirect('/');

      });
}

});
app.post('/delete', function(req,res){
req.checkBody('delstudentname', 'Student name cannot be empty').notEmpty();
const errors = req.validationErrors();
if(errors){
res.render('home', {errors:errors});
}else{
  MongoClient.connect(url, function(err,db){
   if(err) throw err;
   var myQuery={"StudentName":req.body.delstudentname};
   db.collection('mehn').remove(myQuery);
   res.redirect('/');

      });
}

});
app.post('/search', function(req,res){
  req.checkBody('delstudentname', 'Student name cannot be empty').notEmpty();
  const errors = req.validationErrors();
  if(errors){
  res.render('home', {errors:errors});
}else{
  var result1 = [];
  MongoClient.connect(url, function(err, db){
   var qselect = req.body.search_categories;


  switch(qselect){

  case 'StudentName':
  var query={'StudentName':req.body.searchValue};
      break;
  case 'Address':
  var query = {'Address':req.body .searchValue};
      break;
  case 'College':
  var query = {'College':req.body.searchValue};
      break;
  case 'Age':
  var query = {'Age': req.body.searchValue};
      break;
  case 'Phone':
  var query = {'Phone': req.body.searchValue};
     break;
  case 'Status':
  var query = {'Status':req.body.searchValue};
    break;
  }
  var cursor = db.collection('mehn').find(query);
        cursor.forEach(function(doc, err) {
         result1.push(doc);
         }, function() {
           db.close();
           res.render('home', {dataset: result1});
         });
  });
}

});
