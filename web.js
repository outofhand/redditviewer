var express = require('express');
var app = express();
var path = require('path');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


// serve bower components statically
app.use("/bower_components", express.static(__dirname + "/bower_components"));

// for all routes defined on client side send
// entry point to the app
// btw. changes of those routes on client side
// are not supposed to hit server at all (!)
app.use("/app*", function(req, res, next){
    res.sendFile(__dirname + '/app/index.html');
});

// for all public requests try to use /app folder
app.use("/", express.static(__dirname + "/app"));



/*app.get('/', function(request, response) {
  //response.send('Hello World!');
  response.sendFile(path.join(__dirname + '/index.html'));
});
*/
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
