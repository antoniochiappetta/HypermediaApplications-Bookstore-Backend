'use strict';

let { database } = require("./DataLayer");
let Author = require("../models/author");

/**
 * adds a new author
 * Adds a new Author
 *
 * author Author an author (optional)
 * no response value expected for this operation
 **/
exports.addAuthor = function(author) {
  let isAuthorized = true // TODO
  if (isAuthorized) {
    return database.transaction(function(trx) {
      database
        .insert({
          [Author.name]: author.name,
          [Author.lastName]: author.lastName,
          [Author.shortBio]: author.bio,
          [Author.picture]: author.picture
        })
        .into(Author.getTable)
        .transacting(trx)
        .then(function() {
          return {
            response: "Author added",
            status: 201
          }
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
  } else {
    return {
      error: "Only administrators are authorized to perform this operation",
      status: 403
    }
  }
}

/**
 * delete an author
 * Delete an author from the system
 *
 * iD String 
 * no response value expected for this operation
 **/
exports.deleteAuthor = function(iD) {
  let isAuthorized = true // TODO
  if (isAuthorized) {
    return database(Author.getTable)
    .where(Author.id, iD)
    .count()
    .then(function(results) {
      if (results[0].count > 0) {
        return database(Author.getTable)
          .where(Author.id, iD)
          .del()
          .then(function() {
            return {
              message: "Author deleted",
              status: 200
            }
          })
      } else {
        return {
          error: "Author not found",
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
 * Returns the Authors
 * Return the Authors
 *
 * bookISBN String Pass the ISBN of the book for looking up authors (optional)
 * iD String Pass an optional search string for looking up authors (optional)
 * name String Pass an optional search string for looking up authors (optional)
 * last_Name String Pass an optional search string for looking up authors (optional)
 * limit Integer Maximum number of authors to return (optional)
 * page Integer Number of the page (optional)
 * returns List
 **/
exports.getAuthors = function(bookISBN,iD,name,last_Name,limit,page) {
  return database(Author.getTable)
  .modify(function(queryBuilder) {
    if (iD)
      queryBuilder.where(Author.id, iD)
    if (name)
      queryBuilder.where(Author.name, name)
    if (last_Name)
      queryBuilder.where(Author.lastName, last_Name)
    if (bookISBN) {
      queryBuilder.whereIn(Author.id, function() {
        return database(WrittenBy.getTable)
        .where(WrittenBy.A_ID, iD)
      })
    }
  })
  .limit(limit ? limit: 100)
  .offset((limit && page) ? limit*(page-1) : 0)
  .then(function(results) {
    return {
      message: "Authors",
      content: results,
      status: 200
    }
  })
}

/**
 * update an author
 * Update author checking which field is different
 *
 * iD String ID of the author
 * author Author a Author updated (optional)
 * no response value expected for this operation
 **/
exports.updateAuthor = function(iD,author) {
  let isAuthorized = true // TODO
  if (isAuthorized) {
    return database(Author.getTable)
    .where(Author.id, iD)
    .count()
    .then(function(results) {
      if (results[0].count > 0) {
        return database(Author.getTable)
        .where(Author.id, iD)
        .update({
          [Author.name]: author.name,
          [Author.lastName]: author.lastName,
          [Author.shortBio]: author.bio,
          [Author.picture]: author.picture
        })
        .then(function() {
          return {
            response: "Author updated",
            status: 200
          }
        })
      } else {
        return {
          error: "Author not found",
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