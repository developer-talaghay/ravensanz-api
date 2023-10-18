const User = require("../models/userResetPasswordModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

exports.resetPassword = (req, res) => {
  const { token } = req.params;
  const newPassword = req.body.password;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: "Invalid token" });
    }

    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error hashing password" });
      }

      User.resetPassword(decoded.email_add, hashedPassword, (err, data) => {
        if (err) {
          console.error(err);
          if (err.kind === "not_found") {
            return res.status(404).json({ error: "User not found" });
          } else {
            return res.status(500).json({ error: "Error updating user" });
          }
        }

        const html = `
        <html>
        <head>
          <title>Password Reset</title>
          <style>
            body {
              background-color: #61dafb;
            }
            .center {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: aliceblue;
              padding: 20px;
              text-align: center;
              border-radius: 10px;
            }
          </style>
        </head>
        <body>
          <div class="center">
            <h3>Password Updated Successfully! You may close this tab. </h3>
          </div>
        </body>
      </html>
        `;
        res.status(200).send(html);
        
      });
    });
  });
};


// Rest of the controller code...


  
exports.forgotPassword = (req, res) => {
  const email_add = req.body.email_add;

  // Check if the user is of type 'google'
  User.findByEmail(email_add, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        // If the user is not found, respond with "User not found"
        return res.status(404).json({ error: "User not found" });
      } else {
        // Handle other errors, e.g., database errors
        return res.status(500).json({ error: "Error retrieving user" });
      }
    } else if (data.type === "google") {
      // If the user's type is 'google,' respond with "Google authenticated, no need for a password"
      return res.status(200).json({ message: "Google authenticated, no need for a password" });
    } else {
      // For non-Google users, proceed with sending the reset password link
      const token = jwt.sign({ id: data.id, email_add: data.email_add }, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });

      // Replace this link with your specific URL
      // const resetLink = `http://localhost:8000/api/v1/resetpassword/${token}`;
      const resetLink = `http://18.117.252.199:8000/api/v1/resetpassword/${token}`; 

      if (!data.email_verified) {
        // Create a transport object to send the email
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: "developer.talaghay@gmail.com",
            pass: "tcqslwipuknbeocc",
          },
        });

        const mailOptions = {
          from: "Raven Sanz Accounts <noreply@gmail.com>",
          to: email_add,
          subject: "Reset your password",
          text: `Click on the following link to reset your password: ${resetLink}. This link will expire in 5 minutes`,
          html: `<p>Click on the following link to reset your password. This link will expire in 5 minutes</p><a href="${resetLink}">${resetLink}</a>`,
        };

        // Send the email
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error sending email" });
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: "Reset password link sent to email. Check Spam if not seen in the inbox" });
          }
        });
      } else {
        return res.status(200).json({ message: "Email is already verified. No need to send a reset password link." });
      }
    }
  });
};


exports.verifyJWT = (req, res) => {
  const { token } = req.params;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).send("Unauthorized or the token has been expired");
    }
    const { email_add } = decoded;
    res.render("resetpassword", { token, email_add });
  });
};


