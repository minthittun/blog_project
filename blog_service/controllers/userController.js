const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { secretKey, refreshTokenSecret } = require('../middleware/authMiddleware');
const User = require('../models/user');
const { userDataSync } = require('../helpers/httpRequestHelper')

module.exports = {

  registerUser: async (req, res) => {
    try {
      const { fullName, username, password } = req.body;

      // Check if username already exists
      const existingUser = await User.findOne({ where: { username: username } });

      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const user = await User.create({
        fullName,
        username,
        password: hashedPassword
      });

      // sync data
      const postData = { userId: user.id, name: user.fullName };
      await userDataSync(postData)
      // sync data

      res.status(200).json(
          { 
            data: {
              userId: user.id
            },
            message: 'User registered successfully' 
          }
        );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updateUser: async (req, res) => {
    
    try {
      const id = req.params.id;
      const { fullName, username, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.findByPk(id);
      if (user) {
        user.fullName = fullName;
        user.username = username;
        user.password = hashedPassword;
        await user.save();

        // sync data
        const postData = { userId: user.id, name: user.fullName };
        await userDataSync(postData)
        // sync data

        res.status(200).json({id: user.id, fullName: user.fullName, username: user.username});
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  uploadProfilePictureOnly: async (req, res) => {
    
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No profile picture provided' });
      }
      const user = await User.findByPk(req.body.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.profilePicture = file.path; 
      await user.save();
      res.status(200).json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  showProfilePicture: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findByPk(userId);
      if (!user || !user.profilePicture) {
        return res.status(404).json({ message: 'Profile picture not found' });
      }
      const profilePicturePath = path.join(__dirname, '..', user.profilePicture);
      res.status(200).sendFile(profilePicturePath);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      // Find the user by username
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Generate a JWT token
      const accessToken = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '30d' });
      const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, { expiresIn: '60d' });

      res.status(200).json({ fullName: user.fullName, userId: user.id, accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
    
      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not provided' });
      }
    
      jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid refresh token' });
        }
    
        // Generate a new access token
        const accessToken = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '15d' });
        const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, { expiresIn: '30d' });

        res.status(200).json({ accessToken, refreshToken });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }


};
