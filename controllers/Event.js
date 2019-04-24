'use strict';

var utils = require('../utils/writer.js');
var Event = require('../service/EventService');

module.exports.deleteEvent = function deleteEvent (req, res, next) {
  var iD = req.swagger.params['ID'].value;
  Event.deleteEvent(iD)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getEvents = function getEvents (req, res, next) {
  var bookISBN = req.swagger.params['bookISBN'].value;
  var iD = req.swagger.params['ID'].value;
  var venue = req.swagger.params['venue'].value;
  var address = req.swagger.params['address'].value;
  var city = req.swagger.params['city'].value;
  var page = req.swagger.params['page'].value;
  var limit = req.swagger.params['limit'].value;
  Event.getEvents(bookISBN,iD,venue,address,city,page,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getLatestEvents = function getLatestEvents (req, res, next) {
  var page = req.swagger.params['page'].value;
  var limit = req.swagger.params['limit'].value;
  Event.getLatestEvents(page,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postEvent = function postEvent (req, res, next) {
  var event = req.swagger.params['event'].value;
  Event.postEvent(event)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
