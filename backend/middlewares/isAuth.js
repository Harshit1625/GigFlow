const jwt = require("jsonwebtoken");
const { User } = require("../models/User.js");
require("dotenv").config();

const signedKey = process.env.JWT_SECRET_KEY;

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ message: "User not logged in! " });
    const { id } = jwt.verify(token, signedKey);

    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: "User Not Exist!" });

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { isAuth };
