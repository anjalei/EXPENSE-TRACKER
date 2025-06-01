const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const addUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(username, email, password);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields!" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect password!" });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username, email: user.email },
            'my-secret-keyyy',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Login successful!",
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

getUserStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ isPremium: user.isPremium });
  } catch (err) {
    console.error('Error in getUserStatus:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
    addUser,
    loginUser,
 getUserStatus
};
