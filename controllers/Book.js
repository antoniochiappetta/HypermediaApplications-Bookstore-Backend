'use strict';

var utils = require('../utils/writer.js');
var Book = require('../service/BookService');
var Auth = require('./AuthenticationMiddleware');

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

module.exports.getBestSellers = function getBestSellers (req, res, next) {
  Book.getBestSellers()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getBookAuthors = function getBookAuthors (req, res, next) {
  var iSBN = req.swagger.params['ISBN'].value;
  Book.getBookAuthors(iSBN)
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
  var genre = req.swagger.params['genre'].value;
  var theme = req.swagger.params['theme'].value;
  var order_type = req.swagger.params['order_type'].value;
  var page = req.swagger.params['page'].value;
  var limit = req.swagger.params['limit'].value;
  Book.getBooks(iSBN,author,title,release_date,genre,theme,order_type,page,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getFavouriteReadings = function getFavouriteReadings (req, res, next) {
  Book.getFavouriteReadings()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getGenres = function getGenres (req, res, next) {
  Book.getGenres()
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

module.exports.getThemes = function getThemes (req, res, next) {
  Book.getThemes()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postReview = function postReview (req, res, next) {
  const authResponse = Auth.requiresLogin(req);
  if (authResponse.status == 401) {
    utils.writeJson(res, authResponse);
  } else {
    var iD = authResponse.userId;
    var review = req.swagger.params['Review'].value;
    Book.postReview(iD,review)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }
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
