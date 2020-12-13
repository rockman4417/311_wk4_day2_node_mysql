const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  // SELECT ALL USERS
  pool.query("SELECT * FROM users LEFT JOIN usersContact ON users.id = usersContact.user_id LEFT JOIN usersAddress ON users.id = usersAddress.user_id", (err, rows) => {
    
    if (err) return handleSQLError(res, err)
   
    return res.json(rows);
  })
}

const getAllUserInfo = (req, res) => {

  let sql = "SELECT * FROM users LEFT JOIN usersContact ON users.id = usersContact.user_id LEFT JOIN usersAddress ON users.id = usersAddress.user_id ORDER BY users.id"
  console.log(sql)

  pool.query(sql, (err, rows) => {
    
    if (err) return handleSQLError(res, err)
    console.log(rows)
    return res.json(rows);
  })
}

const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  let sql = "SELECT ?? FROM ?? WHERE ?? = ?"
  
  const replacements = ["*", "users", "id", req.params.id]
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, replacements)
  

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    
    return res.json(rows);
  })
}

// const createUser = (req, res) => {
//   // INSERT INTO USERS FIRST AND LAST NAME 
//   let sql = `INSERT INTO ?? (??, ??) VALUES (?, ?)`
//   const replacements = ["users", "first_name", "last_name", req.body.first_name, req.body.last_name]
  
//   // WHAT GOES IN THE BRACKETS
//   sql = mysql.format(sql, replacements)
  

//   pool.query(sql, (err, results) => {
//     if (err) return handleSQLError(res, err)
//     return res.json({ newId: results.insertId });
//   })
// }

const createUser = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME 
  let sqlUsers = `BEGIN; INSERT INTO ?? (??, ??) VALUES (?, ?)`
  let sqlContacts = "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?)"
  let sqlAddresses = "INSERT INTO ?? (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?); COMMIT;"
  const sqlUsersReplacements = ["users", "first_name", "last_name", req.body.first_name, req.body.last_name]
  const sqlContactsReplacements = ["usersContact", "user_id", "phone1", "phone2", "email", last_insert_id(), req.body.phone1, req.body.phone2, req.body.email]
  const sqlAddressesReplacements = ["usersAddress", "user_id", "address", "city", "county", "state", "zip", last_insert_id(), req.body.address, req.body.city, req.body.county, req.body.state, req.body.zip]
  // WHAT GOES IN THE BRACKETS
  sqlUsers = mysql.format(sqlUsers, sqlUsersReplacements)
  sqlContacts = mysql.format(sqlContacts, sqlContactsReplacements)
  sqlAddresses = mysql.format(sqlAddresses, sqlAddressesReplacements)

  console.log(sqlUsers)
  console.log(sqlContacts)
  console.log(sqlAddresses)

  sqlUsers += ";" + sqlContacts + ";"
  sqlUsers += sqlAddresses

  pool.query(sqlUsers, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
  

}

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let sql = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?"
  const replacements = ["users", "first_name", req.body.first_name, "last_name", req.body.last_name, "id", req.params.id]
  
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, replacements)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let sql = `DELETE FROM ?? WHERE ?? = ?`
  replacements = ["users", "first_name", req.params.first_name]
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, replacements)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getAllUserInfo,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}