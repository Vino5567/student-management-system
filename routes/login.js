var express = require('express');
var router = express.Router();
const USER = require('../model/user');


router.get('/login', function(req, res, next) {
  res.send('respond with a resource login');
});


module.exports = router;
