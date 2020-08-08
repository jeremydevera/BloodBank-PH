var express     = require ('express');
var app         = express();
var port        = process.env.PORT || 8080;
var morgan      = require ('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var router      = express.Router();
var appRoutes   = require('./app/routes/api')(router);
var path        = require('path');
var passport    = require('passport');
var social      = require('./app/passport/passport')(app, passport);
var io 			= require('socket.io').listen(app.listen(port));

var SocketSingleton = require('./app/routes/socket-singleton');
var server = http.createServer(app);

SocketSingleton.configure(server); // <--here

app.use(morgan('dev'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);


io.sockets.on('connection', function (socket) {
    console.log('client connect');
    socket.on('echo', function (data) {
        io.sockets.emit('message', data);
    });
})



require('./app/routes/api')(router,io);
module.exports = app;
mongoose.connect('mongodb://localhost:27017/testing', function(err){
    if(err){
        console.log('Not connected' + err);
    } else
    {
        console.log('Connected');
    }
});

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});



