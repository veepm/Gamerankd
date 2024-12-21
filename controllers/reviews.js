import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import { pool } from "../database.js";

export const getAllReviews = async (req, res) => {
  const query = "SELECT * FROM reviews ORDER BY updated_at DESC;";

  const reviews = await pool.query(query);

  res.status(StatusCodes.OK).send({ reviews: reviews.rows });
};

export const addReview = async (req, res) => {
  const { rating, review_text: reviewText } = req.body;
  const { gameId } = req.params;
  const { userId } = req.user;

  const query =
    "INSERT INTO reviews (rating,review_text,user_id,game_id) VALUES ($1,$2,$3,$4) RETURNING *;";

  const review = await pool.query(query, [rating, reviewText, userId, gameId]);

  res.status(StatusCodes.CREATED).send({ review: review.rows[0] });
};

export const updateReview = async (req, res) => {
  const { rating, review_text: reviewText } = req.body;
  const { gameId } = req.params;
  const { userId } = req.user;

  let updateFields = "";
  let values = [gameId, userId];
  if (rating && reviewText !== undefined) {
    values.push(rating, reviewText);
    updateFields = "rating = $3, review_text = $4";
  } else if (rating) {
    values.push(rating);
    updateFields = "rating = $3";
  } else if (reviewText !== undefined) {
    values.push(reviewText);
    updateFields = "review_text = $3";
  } else {
    throw new BadRequestError("Rating and review text not provided");
  }

  const query = `UPDATE reviews SET ${updateFields} WHERE game_id = $1 AND user_id = $2 RETURNING *;`;

  const review = await pool.query(query, values);

  if (review.rowCount === 0) {
    throw new NotFoundError(`No review for game with id ${gameId}`);
  }

  res.status(StatusCodes.OK).send({ review: review.rows[0] });
};

export const deleteReview = async (req, res) => {
  const { gameId } = req.params;
  const { userId } = req.user;

  const query =
    "DELETE FROM reviews WHERE game_id = $1 AND user_id = $2 RETURNING *;";

  const result = await pool.query(query, [gameId, userId]);

  if (result.rowCount === 0) {
    throw new NotFoundError(
      `No review for game with id ${gameId} for current user`
    );
  }

  res.status(StatusCodes.OK).send({ review: result.rows[0] });
};

export const getGameReviews = async (req, res) => {
  const { gameId } = req.params;
  let { limit = 10, page = 1, sortBy = "latest" } = req.query;
  page = Number(page);
  limit = Number(limit);
  const offset = limit * (page - 1);

  // only get reviews with text
  const reviewsQuery = `
    SELECT r.*,username
    FROM reviews r,users u
    WHERE r.user_id = u.user_id AND game_id = $1 AND review_text IS NOT NULL
    ORDER BY r.created_at ${getOrder(sortBy)}
    LIMIT $2
    OFFSET $3;
  `;

  const reviews = await pool.query(reviewsQuery, [gameId, limit, offset]);

  const countQuery =
    "SELECT CAST(COUNT(*) AS INT) FROM reviews WHERE game_id = $1 AND review_text IS NOT NULL;";

  const count = await pool.query(countQuery, [gameId]);

  res.status(StatusCodes.OK).send({
    reviews: reviews.rows,
    review_count: count.rows[0].count,
    total_pages: Math.ceil(count.rows[0].count / limit),
  });
};

export const getUserReviews = async (req, res) => {
  const { username } = req.params;
  let { limit = 10, page = 1, sortBy = "latest" } = req.query;
  page = Number(page);
  limit = Number(limit);
  const offset = limit * (page - 1);

  const query = `
    SELECT r.*
    FROM reviews r, users u
    WHERE r.user_id = u.user_id AND u.username = $1
    ORDER BY r.created_at ${getOrder(sortBy)}
    LIMIT $2
    OFFSET $3;
  `;

  const reviews = await pool.query(query, [username, limit, offset]);

  const countQuery =
    "SELECT CAST(COUNT(*) AS INT) FROM reviews r, users u WHERE r.user_id = u.user_id AND u.username = $1;";

  const count = await pool.query(countQuery, [username]);

  res
    .status(StatusCodes.OK)
    .send({
      reviews: reviews.rows,
      review_count: count.rows[0].count,
      total_pages: Math.ceil(count.rows[0].count / limit),
    });
};

const getOrder = (sortBy) => {
  let order;
  if (sortBy === "oldest") {
    order = "asc";
  } else if (sortBy === "latest") {
    order = "desc";
  }
  return order;
};
