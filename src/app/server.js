import authentication from './oAuth';

var express = require('express');
var cors = require('cors');

var server = new express();
server.use(cors());

server.use(authentication);
server.get('/verifyToken',(req, res) =>{
    res.write("success");
});

server.listen(8080);