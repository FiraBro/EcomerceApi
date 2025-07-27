import jwt from "jsonwebtoken";
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sendToken = (user, res, statusCode = 200) => {
  const token = generateToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.status(statusCode).cookie("token", token, options).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
};

export default sendToken;
