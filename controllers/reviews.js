import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnAuthenticatedError } from "../errors/index.js"
import { pool } from "../database.js";

export const getAllReviews = async (req,res) => {
  const query = "SELECT * FROM reviews ORDER BY updated_at DESC;";

  const reviews = await pool.query(query);

  res.status(StatusCodes.OK).send({data:reviews.rows});
}

export const addReview = async (req,res) => {
  const {rating,review_text:reviewText} = req.body;
  const {gameId} = req.params;
  const {userId} = req.user;

  const query = "INSERT INTO reviews (rating,review_text,user_id,game_id) VALUES ($1,$2,$3,$4);";

  await pool.query(query,[rating,reviewText,userId,gameId]);

  res.status(StatusCodes.CREATED).send();
};

export const updateReview = async (req,res) => {
  const {rating,review_text:reviewText} = req.body;
  const {reviewId} = req.params;
  const {userId} = req.user;

  const query = "UPDATE reviews SET rating = $1,review_text = $2 WHERE review_id = $3 AND user_id = $4;";

  await pool.query(query,[rating,reviewText,reviewId,userId]);

  res.status(StatusCodes.OK).send();
};

export const deleteReview = async (req,res) => {
  const {reviewId} = req.params;
  const {userId} = req.user;

  const query = "DELETE FROM reviews WHERE review_id = $1 AND user_id = $2 RETURNING *;";

  const result = await pool.query(query,[reviewId,userId]);

  if (result.rowCount === 0){
    throw new NotFoundError(`No review with id ${reviewId} for current user`);
  }

  res.status(StatusCodes.OK).send();
};

export const getGameReviews = async (req,res) => {
  const {gameId} = req.params;

  const query = `
    SELECT review_id,rating,review_text,r.created_at,r.updated_at,username
    FROM reviews r,users u
    WHERE r.user_id = u.user_id AND game_id = $1;
  `;

  const reviews = await pool.query(query,[gameId]);

  res.status(StatusCodes.OK).send({reviews:reviews.rows});
};

export const getUserReviews = async (req,res) => {
  const {username} = req.params;

  const query = `
    SELECT review_id,rating,review_text,r.created_at,r.updated_at,game_id
    FROM reviews r, users u
    WHERE r.user_id = u.user_id AND u.username = $1;
  `

  const reviews = await pool.query(query,[username]);

  res.status(StatusCodes.OK).send({reviews:reviews.rows});
};