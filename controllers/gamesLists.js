import { StatusCodes } from "http-status-codes";
import { pool } from "../database.js";
import NotFoundError from "../errors/not-found.js";

export const getList = async (req,res) => {
  const {listId} = req.params;

  const query = `
    SELECT l.*, ARRAY_AGG(game_id)
    FROM lists l
    LEFT JOIN list_games lg ON l.list_id = lg.list_id
    WHERE l.list_id = $1
    GROUP BY l.list_id;
  `;

  const list = await pool.query(query,[listId]);

  res.send(list.rows);
};

export const createList = async (req,res) => {
  const {name} = req.body;
  const {userId} = req.user;
  
  const query = "INSERT INTO lists (list_name,user_id) VALUES ($1,$2);"

  await pool.query(query,[name,userId]);

  res.send()
};

export const deleteList = async (req,res) => {
  const {listId} = req.params;
  const {userId} = req.user;

  const query = "DELETE FROM lists WHERE list_id = $1 AND user_id = $2 RETURNING *;";

  const result = await pool.query(query,[listId,userId]);

  if (result.rowCount === 0){
    throw new NotFoundError(`No list with id ${listId} for current user`);
  }

  res.status(StatusCodes.OK).send();
}

export const addListGame = async (req,res) => {
  const gameId = req.body.game_id;
  const {listId} = req.params;
  const {userId} = req.user;


  const query = `
    INSERT INTO list_games (game_id,list_id)
    SELECT $1,$2
    FROM lists
    WHERE user_id = $3 AND list_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query,[gameId,listId,userId]);

  if (result.rowCount === 0){
    throw new NotFoundError(`No list with id ${listId} for current user`);
  }

  res.status(StatusCodes.CREATED).send();
};

export const deleteListGame = async (req,res) => {
  const gameId = req.body.game_id;
  const {listId} = req.params;
  const {userId} = req.user;

  const validateQuery = "SELECT * FROM lists WHERE list_id = $1 AND user_id = $2;";

  const list = await pool.query(validateQuery,[listId,userId]);

  if (list.rowCount === 0){
    throw new NotFoundError(`No list with id ${listId} for current user`);
  }

  const deleteQuery = `
    DELETE FROM list_games
    WHERE list_id = $1 AND game_id = $2;
  `; 

  const result = await pool.query(deleteQuery,[listId,gameId]);
  
  if (result.rowCount === 0){
    throw new NotFoundError(`No game with id ${gameId} in list`);
  }

  res.status(StatusCodes.OK).send();
}

export const getUserLists = async (req,res) => {
  const {username} = req.params;

  const query =  `
    SELECT l.*, ARRAY_AGG(game_id) as games
    FROM lists l
    LEFT JOIN list_games lg ON l.list_id = lg.list_id
    LEFT JOIN users u ON l.user_id = u.user_id
    WHERE u.username = $1
    GROUP BY l.list_id;
  `;

  const lists = await pool.query(query,[username]);

  res.status(StatusCodes.OK).send(lists.rows);
};