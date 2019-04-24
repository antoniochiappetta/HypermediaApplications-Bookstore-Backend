'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.addToShoppingBag = function addToShoppingBag (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  var item = req.swagger.params['item'].value;
  User.addToShoppingBag(iD,item)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.addUser = function addUser (req, res, next) {
  var user = req.swagger.params['User'].value;
  User.addUser(user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteFromShoppingBag = function deleteFromShoppingBag (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  var iSBN = req.swagger.params['ISBN'].value;
  User.deleteFromShoppingBag(iD,iSBN)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  User.deleteUser(iD)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getInfo = function getInfo (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  User.getInfo(iD)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getShoppingBag = function getShoppingBag (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  var page = req.swagger.params['page'].value;
  var limit = req.swagger.params['limit'].value;
  User.getShoppingBag(iD,page,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateShoppingBag = function updateShoppingBag (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  var iSBN = req.swagger.params['ISBN'].value;
  var item = req.swagger.params['item'].value;
  User.updateShoppingBag(iD,iSBN,item)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateUser = function updateUser (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  var user = req.swagger.params['User'].value;
  User.updateUser(iD,user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userLogin = function userLogin (req, res, next) {
  var email = req.swagger.params['email'].value;
  var password = req.swagger.params['password'].value;
  User.userLogin(email,password)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
