'use strict';

let { database } = require("./DataLayer");
let User = require("../models/user");
let ShoppingBag = require("../models/shoppingbag");
let Book = require("../models/book");

const bcrypt = require('bcrypt');

/**
 * Adds a book in the user's shopping bag
 * Adds a book in the user's shopping bag with the specified quantity
 *
 * iD String User which reservations list is searched
 * item ShoppingBag a Shopping Bag item (optional)
 * no response value expected for this operation
 **/
exports.addToShoppingBag = function(iD,item) {
  console.log(item)
  return database(Book.getTable)
  .where(Book.isbn, item.B_ISBN)
  .count()
  .then(function(results) {
    if (results[0].count > 0) {
      return database(Book.getTable)
      .increment(Book.soldCopies)
      .where(Book.isbn, item.B_ISBN)
      .then(function() {
        console.log(item)
        console.log(User)
        return database(User.getTable)
        .where(User.id, iD)
        .count()
        .then(function(results) {
          if (results[0].count > 0) {
            return database.transaction(function(trx) {
              database
                .insert({
                  [ShoppingBag.user]: iD,
                  [ShoppingBag.book]: item.B_ISBN,
                  [ShoppingBag.quantity]: item.quantity,
                  [ShoppingBag.version]: item.version
                })
                .into(ShoppingBag.getTable)
                .transacting(trx)
                .then(function() {
                  return {
                    response: "Shopping bag item added",
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
 * adds a new user / registration
 * Adds a new user / registration
 *
 * user User a user (optional)
 * no response value expected for this operation
 **/
exports.addUser = function(user) {
  // Encrypt password
  let hashedPassword = bcrypt.hashSync(user.password, 10);
  return database.transaction(function(trx) {
    database
      .insert({
        [User.email]: user.email,
        [User.password]: hashedPassword,
        [User.name]: user.name,
        [User.lastName]: user.lastName,
        [User.isAdmin]: user.isAdmin
      })
      .into(User.getTable)
      .transacting(trx)
      .then(function() {
        return {
          response: "User added",
          status: 201
        }
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
}


/**
 * Remove item from user's shopping bag
 * Remove item from user's shopping bag
 *
 * iD String User which reservations list is searched
 * iSBN String Book ISBN
 * no response value expected for this operation
 **/
exports.deleteFromShoppingBag = function(iD,iSBN) {
  return database(ShoppingBag.getTable)
    .where(ShoppingBag.user, iD)
    .count()
    .then(function(results) {
      if (results[0].count > 0) {
        return database(ShoppingBag.getTable)
        .where(ShoppingBag.book, iSBN)
        .count()
        .then(function(results) {
          if (results[0].count > 0) {
            return database(ShoppingBag.getTable)
            .where(ShoppingBag.user, iD)
            .andWhere(ShoppingBag.book, iSBN)
            .del()
            .then(function() {
              return {
                message: "Shopping bag item deleted",
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
          error: "Shopping bag item not found",
          status: 404
        }
      }
    })
}


/**
 * delete a user
 * Delete a user from the system
 *
 * iD String 
 * no response value expected for this operation
 **/
exports.deleteUser = function(iD) {
  return database(User.getTable)
    .where(User.id, iD)
    .count()
    .then(function(results) {
      if (results[0].count > 0) {
        return database(User.getTable)
          .where(User.id, iD)
          .del()
          .then(function() {
            return {
              message: "User deleted",
              status: 200
            }
          })
      } else {
        return {
          error: "User not found",
          status: 404
        }
      }
    })
}


/**
 * Returns the personal info of the user
 * Returns the personal info of the user which Id is passed
 *
 * iD String ID of the user
 * returns Object
 **/
exports.getInfo = function(iD) {
  return database(User.getTable)
    .where(User.id, iD)
    .then(function(results) {
      if (results.length > 0) {
        return {
          message: "User",
          content: results[0],
          status: 200
        }
      } else {
        return {
          error: "User not found",
          status: 404
        }
      }
    })
}


/**
 * Returns the books in the user's shopping bag
 * Returns the books in the user's shopping bag
 *
 * iD String User which reservations are searched
 * page Integer Number of the page (optional)
 * limit Integer Maximum number of records to return in a single page (optional)
 * returns List
 **/
exports.getShoppingBag = function(iD,page,limit) {
  console.log(iD)
  return database(ShoppingBag.getTable)
    .where(ShoppingBag.user, iD)
    .limit(limit ? limit: 100)
    .offset((limit && page) ? limit*(page-1) : 0)
    .then(function(results) {
      return {
        message: "Shopping Bag",
        content: results,
        status: 200
      }
    })
}


/**
 * Update a shopping bag item
 * Update a shopping bag item
 *
 * iD String User which reservations list is searched
 * iSBN String Book ISBN
 * item ShoppingBag a Shopping Bag item (optional)
 * no response value expected for this operation
 **/
exports.updateShoppingBag = function(iD,iSBN,item) {
  return database(ShoppingBag.getTable)
    .where(ShoppingBag.user, iD)
    .count()
    .then(function(results) {
      if (results[0].count > 0) {
        return database(Book.getTable)
        .where(Book.isbn, iSBN)
        .count()
        .then(function(results) {
          if (results[0].count > 0) {
            return database(ShoppingBag.getTable)
            .where({
              [ShoppingBag.user]: item.U_ID,
              [ShoppingBag.book]: item.B_ISBN
            })
            .update({
              [ShoppingBag.user]: item.U_ID,
              [ShoppingBag.book]: item.B_ISBN,
              [ShoppingBag.quantity]: item.quantity,
              [ShoppingBag.version]: item.version
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
          error: "Shopping bag item not found",
          status: 404
        }
      }
    })
}


/**
 * update a user
 * Update user checking which field is different
 *
 * iD String ID of the user
 * user User a User updated (optional)
 * no response value expected for this operation
 **/
exports.updateUser = function(iD,user) {
  return database(User.getTable)
  .where(User.id, iD)
  .count()
  .then(function(results) {
    if (results[0].count > 0) {
      return database(User.getTable)
      .where(User.id, iD)
      .update({
        [User.email]: user.email,
        [User.password]: user.password,
        [User.name]: user.name,
        [User.lastName]: user.lastName,
        [User.isAdmin]: user.isAdmin
      })
      .then(function() {
        return {
          response: "User updated",
          status: 200
        }
      })
    } else {
      return {
        error: "User not found",
        status: 404
      }
    }
  })
}


/**
 * Login
 * Login with a form
 *
 * email String 
 * password String 
 * no response value expected for this operation
 **/
exports.userLogin = function(email,password) {
  return database(User.getTable)
  .where(User.email, email)
  .then(function(results) {
    if (results.length > 0) {
      let user = results[0]
      console.log(user);
      // Compare sent password with hashed password on the db
      if(bcrypt.compareSync(password, user.password)) {
        // Passwords match, store user in session
        return {
          response: "User logged in",
          userId: user.ID,
          status: 200
        }
       } else {
        // Passwords don't match
        return {
          error: "Wrong credentials",
          status: 401
        }
       }
    } else {
      return {
        error: "User not found",
        status: 404
      }
    }
  })
}

/**
 * Logout
 * Removes user session data
 *
 * no response value expected for this operation
 **/
exports.userLogout = function() {
  return new Promise(function(resolve, reject) {
    let response = {
      response: "User logged out",
      status: 200
    }
    resolve(response);
  });
}

