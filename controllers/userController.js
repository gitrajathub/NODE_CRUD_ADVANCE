const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');



exports.signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    //console.log("req.body", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }
    //console.log("existingUser",existingUser);

    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log("hashedPassword",hashedPassword);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
    } 
    catch (error) {
        //console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server Error' });
  }
};


exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email) {
      const user = await User.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const userObject = user.toObject();
          delete userObject.password;
          
          const token = jwt.sign({ userId: user._id, role: user.role }, 'xd');
          console.log(token);
          res.status(200).json("Login successfully.");


        } else {
          res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      res.status(400).json({ error: 'Please enter an email address' });
    }
  } catch (error) {
    //console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteUser = async (req, res) =>{
  try {
    const userId = req.params.id;
    //console.log(userId);
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } 
  catch (error) {
    //console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateUser = async (req, res)  => {
  try {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password, role },
      { new: true }
    );
     
    if (updatedUser) {
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } 
  catch (error) {
    //console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.adminPage = async (req, res) =>{
  res.status(200).json("ADMIN PAGE");
}

exports.forgotPassword = async (req, res) =>{
  try {
    const {email} = req.body;
    console.log("email",email);

    if (email) {
      const user = await User.findOne({ email });

      if (user) {              
          const token = jwt.sign({ userId: user._id, role: user.role }, 'xd');
          console.log(token);

          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          await user.save();

          const resetLink = `http://localhost:9000/user/resetpassword?token=${token}`;
          const emailContent = `Click the link below to reset your password: ${resetLink}`;
    

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'rajatsinghrawat.2398@gmail.com',
              pass: 'password'
            }
          });

          const mailOptions = {
            from: 'rajatsinghrawat.2398@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: emailContent
          };
          
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
              res.status(500).json({message: "Error"});
            } else {
              console.log('Email sent:', info.response);
              res.status(500).json({message: "Email sent"});
            }
          });

      }
      else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      res.status(400).json({ error: 'Please enter an email address' });
    }
  } 
  catch (error) {
    //console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken: token  });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
