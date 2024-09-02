const { access } = require("fs");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const User = require("../schemas/userSchema");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const googleOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

const allowedOrigins = ["http://localhost:5173", "http://localhost:3001"];

// Function to initiate Google login
const handleGoogleLogin = async (req, res) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
  }

  const authorizeUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
};

const getUserGoogleInfo = async (req, res) => {
  const { user } = req;
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${user.accessToken}`
  );
  const userData = await response.json();
  res.json(userData);
};

// Function to handle the Google OAuth2 callback
const handleGoogleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens } = await googleOAuth2Client.getToken(code);
    googleOAuth2Client.setCredentials(tokens);
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`
    );
    const userData = await response.json();
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = new User({
        email: userData.email,
        picture: userData.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
    } else {
      user.picture = userData.picture;
      user.email = userData.email;
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token;
    }
    await user.save();
    req.session.user = { id: user._id };
  } catch (err) {
    console.log(err);
    return res.redirect("http://localhost:5173/signup");
  }
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5173/expenses");
  });
};

// Renew the access token with the refresh token
const refreshAccessToken = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    const { tokens } = await googleOAuth2Client.refreshToken(user.refreshToken);
    user.accessToken = tokens.access_token;
    await user.save();
    res.json({ message: "Access token refreshed" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  getUserGoogleInfo,
  handleGoogleLogin,
  handleGoogleCallback,
  refreshAccessToken,
};
