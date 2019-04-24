'use strict';

var utils = require('../utils/writer.js');
var Book = require('../service/BookService');

module.exports.addBook = function addBook (req, res, next) {
  var book = req.swagger.params['Book'].value;
  Book.addBook(book)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteBook = function deleteBook (req, res, next) {
  var iSBN = req.swagger.params['ISBN'].value;
  Book.deleteBook(iSBN)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteReview = function deleteReview (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  Book.deleteReview(iD)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getBooks = function getBooks (req, res, next) {
  var iSBN = req.swagger.params['ISBN'].value;
  var author = req.swagger.params['author'].value;
  var title = req.swagger.params['title'].value;
  var release_date = req.swagger.params['release_date'].value;
  var order_type = req.swagger.params['order_type'].value;
  var page = req.swagger.params['page'].value;
  var limit = req.swagger.params['limit'].value;
  Book.getBooks(iSBN,author,title,release_date,order_type,page,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getReviews = function getReviews (req, res, next) {
  var iSBN = req.swagger.params['ISBN'].value;
  var page = req.swagger.params['page'].value;
  var limit = req.swagger.params['limit'].value;
  Book.getReviews(iSBN,page,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postReview = function postReview (req, res, next) {
  var review = req.swagger.params['Review'].value;
  Book.postReview(review)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.similarTo = function similarTo (req, res, next) {
  var iSBN = req.swagger.params['ISBN'].value;
  var page = req.swagger.params['page'].value;
  var limit = req.swagger.params['limit'].value;
  Book.similarTo(iSBN,page,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateBook = function updateBook (req, res, next) {
  var iSBN = req.swagger.params['ISBN'].value;
  var book = req.swagger.params['Book'].value;
  Book.updateBook(iSBN,book)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
