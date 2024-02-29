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
    pass: "uzxehsojsairhlct",
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
      user: "robertchristian.rosales@gmail.com",
      pass: "uzxehsojsairhlct",
    },
  });

  // const verificationLink = `http://localhost:8000/verify/${token}`;
  const verificationLink = `http://3.136.15.249:8000/verify/${token}`;
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

exports.deleteUser = (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user_id in request body' });
  }

  UserModel.deleteUser(user_id, (error, result) => {
    if (error) {
      console.error('Error deleting user and related data: ', error);
      return res.status(500).json({ message: 'Error deleting user and related data' });
    }

    if (result.affectedRows === 0) {
      return res.status(200).json({ message: 'User does not exist' });
    }

    return res.status(200).json({ message: 'User and related data deleted successfully' });
  });
};

exports.createGoogleUser = (req, res) => {
  const { idToken, email, fullName } = req.body;

  // Check if the email address is valid
  if (!isValidEmail(email)) {
    console.error('Error creating Google user: invalid email address');
    return res.status(400).json({ message: 'Invalid email address' });
  }

  // Attempt to create or log in the user in the user_google table
  UserModel.createOrLoginGoogleUser({ idToken, email, fullName }, (error, result) => {
    if (error) {
      console.error('Error creating or logging in Google user: ', error);
      return res.status(500).json({ message: 'Error creating or logging in Google user' });
    }

    if (result.token) {
      // Google user logged in successfully
      const response = {
        message: 'Google user created and logged in successfully',
        token: result.token, // Use the token from the request
        userDetails: result, // Include the user details
      };

      res.status(201).json(response);
    } else {
      console.log('Google user created and logged in successfully');
      res.status(201).json({ message: 'Google user created and logged in successfully' });
    }
  });
};


exports.disableUser = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'ID is required in the request body' });
  }

  UserModel.disableUser(id, (error, result) => {
    if (error === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    } else if (error) {
      console.error('Error disabling user: ', error);
      return res.status(500).send({ message: 'Error disabling user' });
    } else {
      console.log('User disabled successfully');
      res.status(200).json({ message: 'User disabled successfully' });
    }
  });
};

