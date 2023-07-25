const dbConn = require("../config/db.config");

const User = function(user) {
  this.email_add = user.email_add;
  this.password = user.password;
};

User.resetPassword = (email_add, newPassword, result) => {
  dbConn.query(
    "UPDATE user SET password = ? WHERE email_add = ?",
    [newPassword, email_add],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        // not found User with the email
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated user: ", { email_add: email_add });
      result(null, { email_add: email_add }); // Invoke the callback with the updated user data
    }
  );
};

// Rest of the model code...


User.findByEmail = (email_add, result) => {
  dbConn.query(
    "SELECT * FROM user WHERE email_add = ?",
    email_add,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }
      // not found User with the email
      result({ kind: "not_found" }, null);
    }
  );
};

module.exports = User;
