const UserModel = require("../models/userSignupModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Configure nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: "robertchristian.rosales@gmail.com",
    pass: "lxkepxxjeixoymtu",
  }
});

exports.createUser = function (req, res) {
  const newUser = {
    email_add: req.body.email_add.toLowerCase(), // Convert email to lowercase
    password: req.body.password,
  };

  // Check if the email address is valid
  if (!isValidEmail(newUser.email_add)) {
    console.error('Error creating user: invalid email address');
    return res.status(400).send({message:'Invalid email address'});
  }

  UserModel.create(newUser, (error, result) => {
    if (error) {
      if (error === 'Email address already exists') {
        console.error('Error creating user: email already exists');
        return res.status(409).send({
          message: 'Email address already exists'
        });
      }
      console.error("Error creating user: ", error);
      res.status(500).send({message:"Error creating user"});
    } else {
      console.log("User created successfully");

      // Generate JWT token
      const token = jwt.sign({ email: newUser.email_add }, "your-secret-key", {
        expiresIn: "1h", // Set the expiration time for the token (1 hour in this example)
      });

      // Update user status to "pending" and store the token in the database
      UserModel.updateUserStatusAndToken(newUser.email_add, "false", token, (updateError) => {
        if (updateError) {
          console.error("Error updating user status and token: ", updateError);
          return res.status(500).send({message: "Error updating user status and token"});
        } else {
          // Send verification email
          sendVerificationEmail(newUser.email_add, token)
            .then(() => {
              res.status(201).json({
                message: "User created successfully",
                token: token,
                data: result,
              });
            })
            .catch((error) => {
              console.error("Error sending verification email: ", error);
              return res.status(500).send({message: "Error sending verification email"});
            });
        }
      });
    }
  });
};

// Function to send verification email
function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "developer.talaghay@gmail.com",
      pass: "tcqslwipuknbeocc",
    },
  });

  // const verificationLink = `http://localhost:8000/verify/${token}`;
  const verificationLink = `http://3.145.100.103:8000/verify/${token}`;
  const mailOptions = {
    from: "Raven Sanz Accounts <noreply@gmail.com>",
    to: email,
    subject: "Welcome to Raven Sanz! Verify Your Email Address",
    html: `<p>Welcome to Raven Sanz!</p><p>You are one step closer to enjoying the app. Click <a href="${verificationLink}">here</a> to verify your email address.</p>`,
  };

  return transporter.sendMail(mailOptions);
}

// Function to validate email address format
function isValidEmail(email) {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}
