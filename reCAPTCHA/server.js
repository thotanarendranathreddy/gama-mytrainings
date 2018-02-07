var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
//Bodey Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//es6
app.get('/', (req, res) => {
res.sendFile(__dirname + '/index.html');
})


app.post('/login', (req, res) => {
  if(
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ){
    return res.json({"success": false, "msg": "Please pass captcha"});
  }
  // secret key
  const secretKey = '6LfsTzUUAAAAANs0oL-Qo2KZIyjy2WcWkXgSLD0Q';

  //verify URL
  const verify=`https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=$
  {req.connection.remoteAddress}`;
  // Make req to verify urlencoded

  request(verify, (err, response, body) => {
    body = JSON.parse(body);
    console.log(body);
    // If not successfull
    if(body.success !== undefined && !body.success){
      return res.json({"success": false, "msg": "Failed captcha verfication"});
    }else{
          //If successfull
          return res.json({"success": false, "msg": "Failed captcha verfication"});
    }

  })

})


var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
