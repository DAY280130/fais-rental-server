const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.makeToken = ({ id, email, role, nama }) => {
  return jwt.sign(
    {
      id,
      email,
      role,
    },
    process.env.TOKEN_KEY,
    {
      issuer: nama,
      expiresIn: "3h",
    }
  );
};

exports.checkToken = ({ token, role, user }) => {
  try {
    // check token existence
    if (!token) {
      return {
        name: "JsonWebTokenError",
        message: "Token is required for authentication!",
      };
    }
    // check token validation
    let decoded = jwt.verify(token, process.env.TOKEN_KEY, { issuer: user });
    // sanitize decode
    decoded = JSON.parse(JSON.stringify(decoded));
    // check role
    if (decoded.role !== role) {
      return {
        name: "JsonWebTokenError",
        message: "You changed your role don't you?",
      };
    }
    return decoded;
  } catch (err) {
    if (err instanceof SyntaxError) {
      return {
        name: "JsonWebTokenError",
        message: "Data Corrupted",
      };
    } else if (err instanceof jwt.JsonWebTokenError) {
      if (err.message.substring(0, 18) === "jwt issuer invalid") {
        return {
          name: "JsonWebTokenError",
          message: "Who Are You?",
        };
      }
      return err;
    } else {
      console.log(err);
      return {
        name: "UnknownError",
        message: "Unknown error occured",
      };
    }
  }
};
