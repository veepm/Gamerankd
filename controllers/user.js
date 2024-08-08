import { StatusCodes } from "http-status-codes";
import { pool } from "../database.js";

export const getUserGameInfo = async (req, res) => {
  const {username, gameId} = req.params;

  const query = `
    SELECT 
        r.rating,
        CASE WHEN r.review_text IS NULL THEN false ELSE true END AS reviewed,
        CASE WHEN lg1.game_id IS NULL THEN false ELSE true END AS played,
        CASE WHEN lg2.game_id IS NULL THEN false ELSE true END AS wishlisted
    FROM users u
    LEFT JOIN reviews r ON r.user_id = u.user_id AND r.game_id = $1
    LEFT JOIN lists l1 ON l1.user_id = u.user_id AND l1.list_name = 'played'
    LEFT JOIN list_games lg1 ON lg1.list_id = l1.list_id AND lg1.game_id = $1
    LEFT JOIN lists l2 ON l2.user_id = u.user_id AND l2.list_name = 'wishlist'
    LEFT JOIN list_games lg2 ON lg2.list_id = l2.list_id AND lg2.game_id = $1
    WHERE u.username = $2;
  `;

  const result = await pool.query(query,[gameId,username]);

  res.status(StatusCodes.OK).send(result.rows[0]);
}