const User = require("../schemas/userSchema");
const { ApiError } = require("./errorHandler");

const ensureAuthenticated = async (req, res, next) => {
  if (req.session && req.session.user) {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      throw new ApiError("User not found", 401);
    }
    req.user = user;  
    next();
  } else {
    throw new ApiError("Unauthorized", 401);
  }
};

module.exports = { ensureAuthenticated };
