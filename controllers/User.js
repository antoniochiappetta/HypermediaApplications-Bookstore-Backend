'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');
var Auth = require('./AuthenticationMiddleware');

module.exports.addToShoppingBag = function addToShoppingBag (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  const authResponse = Auth.requiresLogin(req, iD);
  if (authResponse.status == 401) {
    utils.writeJson(res, authResponse);
  } else {
    var item = req.swagger.params['item'].value;
    User.addToShoppingBag(iD,item)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }
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
  const authResponse = Auth.requiresLogin(req, iD);
  if (authResponse.status == 401) {
    utils.writeJson(res, authResponse);
  } else {
    var iSBN = req.swagger.params['ISBN'].value;
    User.deleteFromShoppingBag(iD,iSBN)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  const authResponse = Auth.requiresLogin(req, iD);
  if (authResponse.status == 401) {
    utils.writeJson(res, authResponse);
  } else {
    User.deleteUser(iD)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }
};

module.exports.getInfo = function getInfo (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  const authResponse = Auth.requiresLogin(req, iD);
  if (authResponse.status == 401) {
    utils.writeJson(res, authResponse);
  } else {
    User.getInfo(iD)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }

};

module.exports.getShoppingBag = function getShoppingBag (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  const authResponse = Auth.requiresLogin(req, iD);
  if (authResponse.status == 401) {
    utils.writeJson(res, authResponse);
  } else {
    var page = req.swagger.params['page'].value;
    var limit = req.swagger.params['limit'].value;
    User.getShoppingBag(iD,page,limit)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }
};

module.exports.updateShoppingBag = function updateShoppingBag (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  const authResponse = Auth.requiresLogin(req, iD);
  if (authResponse.status == 401) {
    utils.writeJson(res, authResponse);
  } else {
    var iSBN = req.swagger.params['ISBN'].value;
    var item = req.swagger.params['item'].value;
    User.updateShoppingBag(iD,iSBN,item)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }
};

module.exports.updateUser = function updateUser (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  const authResponse = Auth.requiresLogin(req, iD);
  if (authResponse.status == 401) {
    utils.writeJson(res, authResponse);
  } else {
    var user = req.swagger.params['User'].value;
    User.updateUser(iD,user)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }
};

module.exports.userLogin = function userLogin (req, res, next) {
  var email = req.swagger.params['email'].value;
  var password = req.swagger.params['password'].value;
  User.userLogin(email,password)
    .then(function (response) {
      if (response.status == 200) {
        req.session.userId = response.userId;
      }
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
