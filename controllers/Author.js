'use strict';

var utils = require('../utils/writer.js');
var Author = require('../service/AuthorService');

module.exports.addAuthor = function addAuthor (req, res, next) {
  var author = req.swagger.params['Author'].value;
  Author.addAuthor(author)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteAuthor = function deleteAuthor (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  Author.deleteAuthor(iD)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAuthors = function getAuthors (req, res, next) {
  var bookISBN = req.swagger.params['bookISBN'].value;
  var iD = req.swagger.params['ID'].value;
  var name = req.swagger.params['name'].value;
  var last_name = req.swagger.params['last_name'].value;
  var page = req.swagger.params['page'].value;
  var limit = req.swagger.params['limit'].value;
  Author.getAuthors(bookISBN,iD,name,last_name,page,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateAuthor = function updateAuthor (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  var author = req.swagger.params['Author'].value;
  Author.updateAuthor(iD,author)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
