import { pool } from "../database.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/generateTokens.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new BadRequestError("Username, email or password can not be empty");
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const client = await pool.connect();
  let user;

  // transaction to create wishlist and played list while regsitering user
  try {
    await client.query("BEGIN");

    const userQuery =
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email;";
    const userResult = await client.query(userQuery, [username, email, hashed]);
    user = userResult.rows[0];

    const createListQuery =
      "INSERT INTO lists (list_name,user_id) VALUES ('wishlist',$1), ('played',$1);";
    await client.query(createListQuery, [user.user_id]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const { accessToken, refreshToken } = await generateTokens(user.user_id);

  // res.cookie("refreshToken", refreshToken, {
  //   maxAge: 30 * 24 * 60 * 60 * 1000,
  //   httpOnly: true,
  //   secure: true,
  // });
  // res.cookie("accessToken", accessToken, {
  //   maxAge: 15 * 60 * 1000,
  //   httpOnly: true,
  //   secure: true,
  // });

  res.status(StatusCodes.CREATED).send({
    user: {
      userId: user.user_id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  });
};

export const login = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new BadRequestError("Please provide email or username");
  }

  if (!password) {
    throw new BadRequestError("Please provide password");
  }

  const query = "SELECT * FROM users WHERE email=$1 OR username=$2;";

  const result = await pool.query(query, [email, username]);
  const user = result.rows[0];

  if (!user) {
    throw new UnAuthenticatedError("User does not exist");
  }

  if (!(await bcrypt.compare(password, user.password_hash))) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(user.user_id);

  // res.cookie("refreshToken", refreshToken, {
  //   maxAge: 30 * 24 * 60 * 60 * 1000,
  //   httpOnly: true,
  //   secure: true,
  // });
  // res.cookie("accessToken", accessToken, {
  //   maxAge: 15 * 60 * 1000,
  //   httpOnly: true,
  //   secure: true,
  // });

  res.status(StatusCodes.OK).send({
    user: {
      userId: user.user_id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  });
};

export const logout = async (req, res) => {
  const { userId } = req.user;

  const query = "UPDATE users SET refresh_token = NULL WHERE user_id=$1;";

  await pool.query(query, [userId]);

  res.clearCookie("refreshToken", {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });
  res.clearCookie("accessToken", {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });

  res.status(StatusCodes.OK).send();
};

export const refresh = async (req, res) => {
  const { refreshToken: incomingRefreshToken } = req.body;
  if (!incomingRefreshToken) {
    throw new UnAuthenticatedError("Refresh token not found");
  }

  try {
    const payload = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    req.user = { userId: payload.userId, username: payload.username };

    const query = "SELECT * FROM users WHERE user_id=$1;";
    const user = await pool.query(query, [payload.userId]);

    if (user.rowCount === 0) {
      throw new UnAuthenticatedError("Invalid refresh token");
    }

    if (user.rows[0].refresh_token !== incomingRefreshToken) {
      throw new UnAuthenticatedError("Refresh token is either used or expired");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      payload.userId
    );

    // res.cookie("refreshToken", newRefreshToken, {
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   secure: true,
    // });
    // res.cookie("accessToken", accessToken, {
    //   maxAge: 15 * 60 * 1000,
    //   httpOnly: true,
    //   secure: true,
    // });

    res
      .status(StatusCodes.OK)
      .send({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    throw new UnAuthenticatedError(error.message || "Invalid Credentials");
  }
};
