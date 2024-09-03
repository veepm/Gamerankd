import { StatusCodes } from "http-status-codes";
import { pool } from "../database.js";

export const getUsers = async (req, res) => {
  const { limit = 10, page = 1, search } = req.query;
  const offset = limit * (page - 1);

  let userQuery = `
    SELECT u.username, u.created_at, COUNT(r.rating) AS rated, COUNT(CASE WHEN r.review_text IS NOT NULL THEN 1 END) AS reviewed
    FROM users u
    LEFT JOIN reviews r ON u.user_id = r.user_id
  `;

  const userValues = [limit, offset];

  if (search) {
    userQuery += "WHERE UPPER(u.username) LIKE UPPER($3) ";
    userValues.push(`%${search}%`);
  }

  userQuery += "GROUP BY u.user_id LIMIT $1 OFFSET $2;";

  const users = await pool.query(userQuery, userValues);

  let countQuery = "SELECT CAST(COUNT(*) AS INT) FROM users ";

  const countValues = [];
  if (search) {
    countQuery += "WHERE UPPER(username) LIKE UPPER($1);";
    countValues.push(`%${search}%`);
  }

  const count = await pool.query(countQuery, countValues);

  res
    .status(StatusCodes.OK)
    .send({
      users: users.rows,
      count: count.rows[0].count,
      total_pages: Math.ceil(count.rows[0].count / limit),
    });
};

export const getUserGameInfo = async (req, res) => {
  const { username, gameId } = req.params;

  // gets rating of game by user and whether user has reviewed, played, wishlisted game
  const query = `
    SELECT 
        r.rating,
        r.review_text,
        CASE WHEN lg1.game_id IS NULL THEN false ELSE true END AS played,
        CASE WHEN lg2.game_id IS NULL THEN false ELSE true END AS wishlist
    FROM users u
    LEFT JOIN reviews r ON r.user_id = u.user_id AND r.game_id = $1
    LEFT JOIN lists l1 ON l1.user_id = u.user_id AND l1.list_name = 'played'
    LEFT JOIN list_games lg1 ON lg1.list_id = l1.list_id AND lg1.game_id = $1
    LEFT JOIN lists l2 ON l2.user_id = u.user_id AND l2.list_name = 'wishlist'
    LEFT JOIN list_games lg2 ON lg2.list_id = l2.list_id AND lg2.game_id = $1
    WHERE u.username = $2;
  `;

  const result = await pool.query(query, [gameId, username]);

  res.status(StatusCodes.OK).send(result.rows[0]);
};
