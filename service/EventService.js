'use strict';

let { database } = require("./DataLayer");
let Event = require("../models/event");
let Book = require("../models/book");


/**
 * Delete a presentation event
 * Delete a presentation event
 *
 * iD String 
 * no response value expected for this operation
 **/
exports.deleteEvent = function(iD) {
  let isAuthorized = true // TODO
  if (isAuthorized) {
    return database(Event.getTable)
      .where(Event.id, iD)
      .count()
      .then(function(results) {
        if (results[0].count > 0) {
          return database(Event.getTable)
            .where(Event.id, iD)
            .del()
            .then(function() {
              return {
                message: "Event deleted",
                status: 200
              }
            })
        } else {
          return {
            error: "Event not found",
            status: 404
          }
        }
      })
  } else {
    return {
      error: "Only administrators are authorized to perform this operation",
      status: 403
    }
  }
}


/**
 * Returns the presentation events of books in alphabetical order
 *
 * bookISBN String Pass the ISBN of the book for looking up events (optional)
 * iD String Pass an optional search string for looking up events (optional)
 * venue String Pass an optional search string for looking up events (optional)
 * address String Pass an optional search string for looking up events (optional)
 * city String Pass an optional search string for looking up events (optional)
 * last_name String Pass an optional search string for looking up events (optional)
 * page Integer Number of the page (optional)
 * limit Integer Maximum number of records to return in a single page (optional)
 * returns List
 **/
exports.getEvents = function(bookISBN,iD,venue,address,city,page,limit) {
  return database(Event.getTable)
  .modify(function(queryBuilder) {
    if (iD)
      queryBuilder.where(Event.id, iD)
    if (venue)
      queryBuilder.where(Event.venue, venue)
    if (address)
      queryBuilder.where(Event.address, address)
    if (city)
      queryBuilder.where(Event.city, city)
    if (bookISBN) {
      queryBuilder.where(Event.book, iSBN)
    }
  })
  .limit(limit ? limit: 100)
  .offset((limit && page) ? limit*(page-1) : 0)
}


/**
 * Returns the presentation events in the last month
 *
 * page Integer Number of the page (optional)
 * limit Integer Maximum number of records to return in a single page (optional)
 * returns List
 **/
exports.getLatestEvents = function(page,limit) {
  return database(Event.getTable)
  .whereBetween(Event.startingDate, [new Date((new Date()).getTime() - 2592000000), new Date()])
  .limit(limit ? limit: 100)
  .offset((limit && page) ? limit*(page-1) : 0)
}


/**
 * Post a presentation event
 * Post a presentation event
 *
 * event Event an Event (optional)
 * no response value expected for this operation
 **/
exports.postEvent = function(event) {
  let isAuthorized = true // TODO
  if (isAuthorized) {
    return database(Book.getTable)
    .where(Book.isbn, event.B_ISBN)
    .count()
    .then(function(results) {
      if (results[0].count > 0) {
        return database.transaction(function(trx) {
          database
            .insert({
              [Event.book]: event.B_ISBN,
              [Event.startingDate]: event.startingDate,
              [Event.endingDate]: event.endingDate,
              [Event.venue]: event.venue,
              [Event.address]: event.address,
              [Event.city]: event.city
            })
            .into(Event.getTable)
            .transacting(trx)
            .then(function() {
              return {
                response: "Event added",
                status: 201
              }
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
      } else {
        return {
          error: "Book not found",
          status: 404
        }
      }
    })
  } else {
    return {
      error: "Only administrators are authorized to perform this operation",
      status: 403
    }
  }
}

