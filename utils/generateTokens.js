import { pool } from "../database.js";
import jwt from "jsonwebtoken";

export const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
  });

  const query = "UPDATE users SET refresh_token=$1 WHERE user_id=$2;";
  await pool.query(query, [refreshToken, userId]);

  return { accessToken, refreshToken };
};
