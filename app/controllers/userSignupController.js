const UserModel = require("../models/userSignupModel");
const nodemailer = require("nodemailer");

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
    return res.status(400).send('Invalid email address');
  }

  UserModel.create(newUser, (error, result) => {
    if (error) {
      if (error === 'Email address already exists') {
        console.error('Error creating user: email already exists');
        return res.status(409).send('Email address already exists');
      }
      console.error("Error creating user: ", error);
      res.status(500).send("Error creating user");
    } else {
      console.log("User created successfully");

     // Send welcome email
const mailOptions = {
  from: "Raven Sanz Accounts <noreply@gmail.com>",
  to: newUser.email_add,
  subject: "Welcome to Raven Sanz",
  text: "You are now registered and may continue to login!"
};

// Check if the email address exists before sending the email
transporter.verify((error, success) => {
  if (error) {
    console.error("Error verifying email address: ", error);
    return res.status(500).send("Error verifying email address");
  }

  if (success) {
    // Email address exists, send the welcome email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending welcome email: ", error);
        return res.status(500).send("Error sending welcome email");
      } else {
        console.log("Welcome email sent: ", info.response);
        res.status(201).json({
          message: "User created successfully",
          data: result,
        });
      }
    });
  } else {
    console.error('Email address does not exist');
    return res.status(404).send('Email address does not exist, double check email address. Make sure it exists in Gmail or other email services.');
  }
});
      res.status(201).json({
        message: "User created successfully",
        data: result,
      });
    }
  });
};

// Function to validate email address format
function isValidEmail(email) {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}
