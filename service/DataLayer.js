/**
 *  Created by Antonio Chiappetta on 06/03/2019
 */

 /**
  * README - How to setup local database on Postgre
  * 1) Download latest Postgre distribution together with the tool pgAdmin 4 and setup password for the default server
  * 2) Open pgAdmin 4 and enter the default server named PostgreSQL with username 'postgres', password: {{your-password}}
  * 3) Right click on the server and check that Connection/Port is set to 5432
  * 4) Right click on Login/Group Roles and create user 'ganesh' with Definition/Password 'ballerinidiganesh' and Privileges/can login? 'Yes'
  * 5) Right click on Databases and create db 'e-commerce-hypermedia' with owner 'ganesh'
  * 6) To export DB for deployment use PGPASSWORD=ballerinidiganesh /Library/PostgreSQL/11/bin/pg_dump -Fc --no-acl -U ganesh e-commerce-hypermedia > bookstore-hypermedia.dump
  * 7) Then deploy the dump on a public url and setup Heroku's DATABASE_URL config var to point at it
  */

const sqlDbFactory = require("knex");

// LOCAL

// let sqlDb = sqlDbFactory({
//   client: "pg",
//   connection: {
//     user: 'ganesh',
//     host: 'localhost',
//     database: 'e-commerce-hypermedia',
//     password: 'ballerinidiganesh',
//     port: 5432
//   },
//   searchPath: ['ecommerce'],
//   ssl: true,
//   debug: true
// });

// REMOTE

let sqlDb = sqlDbFactory({
  client: "pg",
  connection: process.env.DATABASE_URL,
  searchPath: ['ecommerce'],
  ssl: true,
  debug: true
});

/**
 * Use the connection data specified before to connect to the database on localhost and test the connection with a query on DB version
 */

function setupDataLayer() {
  console.log("Setting up data layer");
  return sqlDb.raw('SELECT version()')
}

module.exports = { database: sqlDb, setupDataLayer };
