const User = require("../schemas/userSchema");

exports.ensureAuthenticated = async (req, res, next) => {
  if (req.session && req.session.user) {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } else {
    // User is not authenticated
    res.status(401).json({ message: "Unauthorized" });
  }
};
