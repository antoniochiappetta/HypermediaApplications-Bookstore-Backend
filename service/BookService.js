'use strict';

let { database } = require("./DataLayer");
var Promise = require('bluebird');
let Book = require("../models/book");
let WrittenBy = require("../models/writtenby");
let Review = require("../models/review");
let User = require("../models/user");

/**
 * Adds a book
 * Adds a book to the system
 *
 * book Book a book (optional)
 * no response value expected for this operation
 **/
exports.addBook = function(book) {
  let isAuthorized = true // TODO
  if (isAuthorized) {
    return database.transaction(function(trx) {
      database
        .insert({
          [Book.isbn]: book.ISBN,
          [Book.factSheet]: book.factSheet,
          [Book.picture]: book.picture,
          [Book.genre]: book.genre,
          [Book.abstract]: book.abstract,
          [Book.releaseDate]: book.releaseDate,
          [Book.title]: book.title,
          [Book.theme]: book.theme,
          [Book.price]: book.price,
          [Book.interview]: book.interview
        })
        .into(Book.getTable)
        .transacting(trx)
        .then(function(_ids) {
          console.log(book.authors)
          return Promise.map(book.authors, function(authorId) {
            console.log(authorId)
            return database
              .insert({
                [WrittenBy.book]: book.ISBN,
                [WrittenBy.author]: authorId
              })
              .into(WrittenBy.getTable)
              .transacting(trx)
          })
        })
        .then(function() {
          return {
            response: "Book added",
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
 * Delete a book
 * Delete a book in the system
 *
 * iSBN String ISBN of the book we want to delete
 * no response value expected for this operation
 **/
exports.deleteBook = function(iSBN) {
  let isAuthorized = true // TODO
  if (isAuthorized) {
    return database(Book.getTable)
    .where(Book.isbn, iSBN)
    .count()
    .then(function(results) {
      if (results[0].count > 0) {
        return database(Book.getTable)
          .where(Book.isbn, iSBN)
          .del()
          .then(function() {
            return {
              message: "Book deleted",
              status: 200
            }
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


/**
 * Delete a review
 * Delete a review from the system
 *
 * iD String 
 * no response value expected for this operation
 **/
exports.deleteReview = function(iD) {
  return database(Review.getTable)
    .where(Review.id, iD)
    .count()
    .then(function(results) {
      if (results[0].count > 0) {
        return database(Review.getTable)
          .where(Review.id, iD)
          .del()
          .then(function() {
            return {
              message: "Review deleted",
              status: 200
            }
          })
      } else {
        return {
          error: "Review not found",
          status: 404
        }
      }
    })
}


/**
 * Returns the Books
 * By passing in the appropriate options, you can search for available inventory in the system
 *
 * iSBN String Pass an optional search string for looking up books (optional)
 * author String Pass an optional search string for looking up books (optional)
 * title String Pass an optional search string for looking up books (optional)
 * release_date date Pass an optional search string for looking up books (optional)
 * order_type String Pass an optional order in which receive the list of books (default is 'alphabetic') (optional)
 * page Integer Number of the page (optional)
 * limit Integer Maximum number of records to return (optional)
 * returns List
 **/
exports.getBooks = function(iSBN,author,title,release_date,order_type,page,limit) {
  return database(Book.getTable)
  .modify(function(queryBuilder) {
    if (iSBN)
      queryBuilder.where(Book.isbn, iSBN)
    if (author)
      queryBuilder.where(Book.author, author)
    if (title)
      queryBuilder.where(Book.title, title)
    if (release_date)
      queryBuilder.where(Book.releaseDate, release_date)
    if (order_type) {
      switch (order_type) {
        case Book.orderType.soldCopies:
          queryBuilder.orderBy(Book.soldCopies)
          break
        case Book.orderType.releaseDate:
          queryBuilder.orderBy(Book.releaseDate)
          break
        case Book.orderType.suggested:
          // TODO: Add suggestions
          break
        default:
          queryBuilder.orderBy(Book.title)
          break
      }
    } else {
      queryBuilder.orderBy(Book.title)
    }
  })
  .limit(limit ? limit: 100)
  .offset((limit && page) ? limit*(page-1) : 0)
  .then(function(results) {
    return {
      message: "Books",
      content: results,
      status: 200
    }
  })
}


/**
 * Returns all the book similar to a book
 * Returns all the book similar to the book with the ISBN passed
 *
 * iSBN String ISBN of the book we want to get Reviews
 * limit Integer Maximum number of reviews to return (optional)
 * returns List
 **/
exports.getReviews = function(iSBN,page,limit) {
  return database(Review.getTable)
    .where(Review.book, iSBN)
    .limit(limit ? limit: 100)
    .offset((limit && page) ? limit*(page-1) : 0)
    .then(function(results) {
      return {
        message: "Reviews",
        content: results,
        status: 200
      }
    })
}


/**
 * Post a review
 * Post a review to the system
 *
 * review Review a Review (optional)
 * no response value expected for this operation
 **/
exports.postReview = function(review) {
  return database(Book.getTable)
  .where(Book.ISBN, review.book)
  .count()
  .then(function(results) {
    if (results[0].count > 0) {
      return database(User.getTable)
      .where(User.ID, review.user)
      .count()
      .then(function(results) {
        if (results[0].count > 0) {
          return database.transaction(function(trx) {
            database
              .insert({
                [Review.user]: review.U_ID,
                [Review.book]: review.B_ISBN,
                [Review.date]: review.date,
                [Review.description]: review.description,
                [Review.rating]: review.rating
              })
              .into(Review.getTable)
              .transacting(trx)
              .then(function() {
                return {
                  response: "Review added",
                  status: 201
                }
              })
              .then(trx.commit)
              .catch(trx.rollback)
          })
        } else {
          return {
            error: "User not found",
            status: 404
          }
        }
      })
    } else {
      return {
        error: "Book not found",
        status: 404
      }
    }
  })
}


/**
 * Returns all the book similar to a book
 * Returns all the book similar to the book with the ISBN passed
 *
 * iSBN String ISBN of the book we want to find similar books
 * limit Integer Maximum number of books to return (optional)
 * returns List
 **/
exports.similarTo = function(iSBN,page,limit) {
  return database(Book.getTable)
  .where(Book.isbn, iSBN)
  .count()
  .then(function(results) {
    if (results[0].count > 0) {
      console.log(results)
      return database(Book.getTable)
        .whereNot(Book.isbn, iSBN)
        .whereIn(Book.isbn, function() {
          this
            .select(WrittenBy.book)
            .from(WrittenBy.getTable)
            .whereIn(WrittenBy.author, function() {
              this
                .select(WrittenBy.author)
                .from(WrittenBy.getTable)
                .where(WrittenBy.book, iSBN)
            })
        })
        .limit(limit ? limit: 100)
        .offset((limit && page) ? limit*(page-1) : 0)
        .then(function(results) {
          return {
            message: "Books",
            content: results,
            status: 200
          }
        })
    } else {
      return {
        error: "Book not found",
        status: 404
      }
    }
  })
}


/**
 * Update a book
 * Update a book in the system
 *
 * iSBN String ISBN of the book we want to update
 * book Book a book updated (optional)
 * no response value expected for this operation
 **/
exports.updateBook = function(iSBN,book) {
  let isAuthorized = true // TODO
  if (isAuthorized) {
    return database(Book.getTable)
    .where(Book.isbn, iSBN)
    .count()
    .then(function(results) {
      if (results[0].count > 0) {
        return database(Book.getTable)
        .where(Book.isbn, iSBN)
        .update({
          [Book.ISBN]: book.isbn,
          [Book.factSheet]: book.factSheet,
          [Book.picture]: book.picture,
          [Book.genre]: book.genre,
          [Book.abstract]: book.abstract,
          [Book.releaseDate]: book.releaseDate,
          [Book.title]: book.title,
          [Book.theme]: book.theme,
          [Book.price]: book.price,
          [Book.interview]: book.interview
        })
        .then(function() {
          return {
            response: "Book updated",
            status: 200
          }
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

