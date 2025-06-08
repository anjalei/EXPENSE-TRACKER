const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const ForgotPasswordRequest = require('../model/forgotPasswordRequest');
const sendMail = require('../util/mailer');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const requestId = uuidv4();
    await ForgotPasswordRequest.create({
      id: requestId,
      userId: user.id,
      isActive: true,
    });

    const resetLink = `http://localhost:3000/api/password/resetpassword/${requestId}`;
    await sendMail(
      email,
      'Reset Your Password',
      `Click here to reset: ${resetLink}`,
      `<p><a href="${resetLink}">Reset your password</a></p>`
    );

    res.status(200).json({ message: 'Reset link sent if email exists.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.resetPasswordForm = async (req, res) => {
  const requestId = req.params.id;
  try {
    const request = await ForgotPasswordRequest.findOne({
      where: { id: requestId, isActive: true }
    });
    if (!request) {
      return res.status(400).send('<h2>Invalid or expired link</h2>');
    }
    res.send(`
      <form action="/api/password/resetpassword/${requestId}" method="POST">
        <label>New Password:</label><br>
        <input type="password" name="newpassword" required /><br>
        <button type="submit">Reset Password</button>
      </form>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('<h2>Something went wrong</h2>');
  }
};

exports.resetPassword = async (req, res) => {
  const requestId = req.params.id;
  const { newpassword } = req.body;
  try {
    const request = await ForgotPasswordRequest.findOne({
      where: { id: requestId, isActive: true }
    });
    if (!request) {
      return res.status(400).send('<h2>Invalid or expired link</h2>');
    }

    const user = await User.findByPk(request.userId);
    if (!user) {
      return res.status(404).send('<h2>User not found</h2>');
    }

    const hashed = await bcrypt.hash(newpassword, 10);
    user.password = hashed;
    await user.save();

    request.isActive = false;
    await request.save();

    res.send('<h2>Password updated! You can now <a href="/login.html">login</a>.</h2>');
  } catch (err) {
    console.error(err);
    res.status(500).send('<h2>Something went wrong</h2>');
  }
};
