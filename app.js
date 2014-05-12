var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

app.get('/', function(req, res) {
    res.render('index');
});



// setup for heroku
var port = Number(process.env.PORT || 5420);

var server = app.listen(port, function() {
    console.log('Express server listening on port ' + server.address().port);
});