import { UnAuthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader && !req.cookies.accessToken) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }

  const token = req.cookies.accessToken || authHeader;
  
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { userId: payload.userId, username: payload.username };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

export default auth;
