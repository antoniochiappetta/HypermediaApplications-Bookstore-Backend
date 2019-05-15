'use strict';

let { database } = require("./DataLayer");
var Promise = require('bluebird');
let Book = require("../models/book");
let WrittenBy = require("../models/writtenby");
let Review = require("../models/review");
let User = require("../models/user");
let ShoppingBag = require("../models/shoppingbag");
let Author = require("../models/author");

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
      console.log(book)
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
 * Get a list of best sellers
 * All the books ordered according to their number of sold copies (i.e. times posted in a shopping bag)
 *
 * returns List
 **/
exports.getBestSellers = function() {
  return database(Book.getTable)
  .orderBy(Book.soldCopies, "desc")
  .limit(10)
  .then(function(results) {
    return {
      message: "Books",
      content: results,
      status: 200
    }
  })
}

/**
 * Return the authors of the book
 * Return the authors of the book
 *
 * iSBN String ISBN of the book
 * returns List
 **/
exports.getBookAuthors = function(iSBN) {
  return database(Author.getTable)
  .whereIn(Author.id, function() {
    this
      .select(WrittenBy.author)
      .from(WrittenBy.getTable)
      .where(WrittenBy.book, iSBN)
  })
  .then(function(results) {
    return {
      message: "Authors",
      content: results,
      status: 200
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
exports.getBooks = function(iSBN,author,title,release_date,genre,theme,order_type,page,limit) {
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
    if (genre)
      queryBuilder.where(Book.genre, genre)
    if (theme)
      queryBuilder.where(Book.theme, theme)
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
 * Get a list of favourite readings
 * All the books ordered according to their presence in users' shopping bags
 *
 * returns List
 **/
exports.getFavouriteReadings = function() {
  return database(ShoppingBag.getTable)
  .select(ShoppingBag.book)
  .groupBy(ShoppingBag.book)
  .count()
  .orderBy('count', 'desc')
  .map(function(row) {
    return database(Book.getTable)
    .where(Book.isbn, row.B_ISBN)
  })
  .then(function(results) {
    return {
      message: "Books",
      content: results,
      status: 200
    }
  })
}


/**
 * Get list of genres
 * Get list of genres
 *
 * returns List
 **/
exports.getGenres = function() {
  return database(Book.getTable)
  .then(function() {
    return {
      message: "Genres",
      content: [
        "Action and adventure",
        "Alternate history",
        "Anthology",
        "Art",
        "Autobiography",
        "Biography",
        "Book review",
        "Chick lit",
        "Children's literature",
        "Cookbook",
        "Comic book",
        "Coming-of-age",
        "Crime",
        "Diary",
        "Dictionary",
        "Drama",
        "Encyclopedia",
        "Fairytale",
        "Fantasy",
        "Guide",
        "Graphic novel",
        "Health",
        "History",
        "Historical fiction",
        "Horror",
        "Journal",
        "Math",
        "Memoir",
        "Mystery",
        "Paranormal romance",
        "Picture book",
        "Poetry",
        "Political thriller",
        "Prayer",
        "Religion, spirituality, and new age",
        "Review",
        "Romance",
        "Satire",
        "Science",
        "Science fiction",
        "Self help",
        "Short story",
        "Suspense",
        "Thriller",
        "Travel",
        "True crime",
        "Young adult"
      ],
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
 * Get list of themes
 * Get list of themes
 *
 * returns List
 **/
exports.getThemes = function() {
  return database(Book.getTable)
  .then(function() {
    return {
      message: "Themes",
      content: [
        "Love",
        "Death",
        "Good vs Evil",
        "Coming of Age",
        "Power and Corruption",
        "Survival",
        "Courage and Heroism",
        "Prejudice",
        "Individual vs Society",
        "War"
      ],
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
exports.postReview = function(iD,review) {
  return database(Book.getTable)
  .where(Book.isbn, review.B_ISBN)
  .count()
  .then(function(results) {
    if (results[0].count > 0) {
      return database(User.getTable)
      .where(User.id, iD)
      .count()
      .then(function(results) {
        if (results[0].count > 0) {
          console.log(iD)
          console.log(review)
          return database.transaction(function(trx) {
            database
              .insert({
                [Review.user]: iD,
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

