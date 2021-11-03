const User = require('../models/userModel');

const bcryptjs = require('bcryptjs');

exports.signUp = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({
      username,
      password: hashPassword
    });
    req.session.user = user;
    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch(e) {
    res.status(400).json({
      status: 'fail',
      err: e,
    });
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    const isCorrect = await bcryptjs.compare(password, user.password);
    if (isCorrect) {
      console.log(user);
      req.session.user = user;
      res.status(200).json({
        status: 'success',
      });
    } else {
      res.status(400).json({
        status: 'fail',
      });
    }
  } catch(e) {
    res.status(400).json({
      status: 'fail',
      err: e,
    });
  }
}