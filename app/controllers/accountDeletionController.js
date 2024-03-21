const bcrypt = require('bcrypt');
const UserModel = require('../models/accountDeletionModel');

const accountDeletionController = {};

accountDeletionController.login = (req, res) => {
    const { email_add, password } = req.body;

    // Check if email and password are provided
    if (!email_add || !password) {
        return res.status(400).json({ message: "Missing email or password" });
    }

    // Call the model to fetch user by email
    UserModel.getUserByEmail(email_add, (error, user) => {
        if (error) {
            console.error("Error retrieving user: ", error);
            return res.status(500).json({ message: "Error logging in" });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        bcrypt.compare(password, user.password, (bcryptError, result) => {
            if (bcryptError) {
                console.error("Error comparing passwords: ", bcryptError);
                return res.status(500).json({ message: "Error logging in" });
            }
            if (!result) {
                return res.status(401).json({ message: "Incorrect password" });
            }

            // Passwords match, user logged in successfully
            // Save user data in cookies
            res.cookie("user", JSON.stringify(user), { maxAge: 86400000 }); // Cookie expires in 1 day (86400000 milliseconds)
            return res.status(200).json({ message: "Logged in successfully", user: user });
        });
    });
};


// Function to render the accountDeletion.ejs file
accountDeletionController.renderAccountDeletionLogin = (req, res) => {
    res.render('accountDeletionLogin'); // Assuming accountDeletion.ejs is in the views folder
};


accountDeletionController.renderAccountDeletionPage = (req, res) => {
    res.render('accountDeletionPage'); // Assuming accountDeletion.ejs is in the views folder
};


accountDeletionController.deleteUserInsertFeedback = (req, res) => {
    const { id: userId, email_add, feedback } = req.body;
    const missingFields = [];

    // Check for missing required data
    if (!userId) {
        missingFields.push('userId');
    }
    if (!email_add) {
        missingFields.push('email_add');
    }
    if (!feedback) {
        missingFields.push('feedback');
    }

    if (missingFields.length > 0) {
        return res.status(400).json({ message: 'Missing required fields in request body', missingFields });
    }

    UserModel.deleteUser(userId, (error, result) => {
        if (error) {
            console.error('Error deleting user and related data: ', error);
            return res.status(500).json({ message: 'Error deleting user and related data' });
        }

        if (result.affectedRows === 0) {
            return res.status(200).json({ message: 'User does not exist' });
        }

        // Insert feedback into feedback table
        UserModel.insertFeedback(email_add, feedback, (feedbackError, feedbackId) => {
            if (feedbackError) {
                console.error('Error inserting feedback: ', feedbackError);
                return res.status(500).json({ message: 'Error inserting feedback' });
            }

            return res.status(200).json({ message: 'User and related data deleted successfully', feedbackId });
        });
    });
};




module.exports = accountDeletionController;
