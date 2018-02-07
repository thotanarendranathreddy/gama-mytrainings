var express = require('express');
var app=express();



app.get('/', (req,res) => {
	res.sendFile(__dirname+'/index.html')
});



var server = app.listen(3000, function(){
	
	var host = server.address().address;
	var port = server.address().port;
	console.log("numbersAPI is live ate http://%s:%s",host,port);
})