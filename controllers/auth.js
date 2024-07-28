import { pool } from "../database.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

export const register = async (req,res)=>{
  const {username, email, password} = req.body;

  if (!username || !email || !password){
    throw new BadRequestError("Username, email or password can not be empty");
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password,salt);
  const query = "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *;";

  const result = await pool.query(query,[username,email,hashed]);
  const user = result.rows[0];

  const token = jwt.sign({userId:user.user_id, username:user.username}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
  res.status(StatusCodes.CREATED).send({user:{userId:user.user_id, username:user.username, email:user.email}, token});
};

export const login = async (req,res) => {
  const {email, password} = req.body;

  if (!email || !password){
    throw new BadRequestError("Please provide email and password");
  }

  const query = "SELECT * FROM users WHERE email=$1;";

  const result = await pool.query(query,[email]);
  const user = result.rows[0];

  if (!user || ! await bcrypt.compare(password,user.password_hash)){
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const token = jwt.sign({userId:user.user_id, username:user.username}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
  res.status(StatusCodes.OK).send({user:{userId:user.user_id, username:user.username, email:user.email}, token});
};