var express = require('express');
var path = require('path');
var util=require('util');
var fs=require('fs');
var expressValidator = require('express-validator');
var app = express();
app.use(express.static('public'));


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/IFB";


//Bodey Parser Middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
// View Engine
var exphbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');
//end view Engine for handlebars

var server = app.listen(8085, function () {
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
		req.checkBody('studentname', 'studentname field cannot be empty').notEmpty();
		req.checkBody('college', 'college field cannot be empty').notEmpty();
		req.checkBody('address', 'address field cannot be empty').notEmpty();
		req.checkBody('age', 'age field cannot be empty').notEmpty();
		req.checkBody('phone', 'phone field cannot be empty').notEmpty();
		req.checkBody('status', 'status field cannot be empty').notEmpty();
		const errors = req.validationErrors();
		if(errors){
			   res.render('home', {errors: errors});
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


app.post('/update', function(req,res){
  MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myquery = { "StudentName": req.body.newstudentname };
        var newvalues =  {$set:{ "Status":req.body.newstatus } };
        db.collection("mehn").update(myquery, newvalues );
              res.redirect('/');
});
});
app.post('/delete', function(req,res){
  MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myquery = { "StudentName": req.body.delstudentname };
        db.collection("mehn").remove(myquery );
              res.redirect('/');
});
});

app.post('/search', function(req,res){
  var result = [];
MongoClient.connect(url, function(err, db) {
  var qselect = req.body.search_categories;
  switch(qselect){
    case 'StudentName':
        var query = { 'StudentName': req.body.searchValue };
        break;
    case 'Address':
        var query = { 'Address': req.body.searchValue };
        break;
    case 'College':
        var query = { 'College': req.body.searchValue };
        break;
    case 'Age':
        var query = { 'Age': req.body.searchValue };
        break;
    case 'Phone':
        var query = { 'Phone': req.body.searchValue };
        break;
    case 'Status':
        var query = { 'Status': req.body.searchValue };
        break;
  }
var cursor = db.collection('mehn').find(query);
  cursor.forEach(function(doc, err) {
    result.push(doc);
  }, function() {
    db.close();
        res.render('home', {dataset: result});
  });
          });
});
