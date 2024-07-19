import { StatusCodes } from "http-status-codes";
import instance from "../axios.js"
import { BadRequestError } from "../errors/index.js"
import { pool } from "../database.js";

export const getGames = async (req, res) => {
  const {coverSize="thumb", search, genres, rating, minYear, maxYear, limit=10, page, id} = req.query;

  // using IGDB rating_count to get more popular games first
  let query = 'fields name,cover.url,summary,genres.name,first_release_date,involved_companies.publisher, involved_companies.developer,involved_companies.company.name,platforms.name; sort rating_count desc;'; 

  let filters = [];

  if (genres){
    filters.push(`genres=(${genres})`); // finds all games with a genre in the list
  }
  
  //Using database
  if (rating){
    filters.push()
    query += `rating=`;
  }
  if (minYear){
    const unixTime = Math.floor(new Date(`${minYear}-01-01`).getTime()/1000);
    filters.push(`first_release_date >= ${unixTime}`);
  }
  if (maxYear){
    const unixTime = Math.floor(new Date(`${maxYear}-12-31`).getTime()/1000);
    filters.push(`first_release_date <= ${unixTime}`);
  }
  if (search){
    filters.push(`name ~ *"${search}"*`);
  }
  if (id){
    filters.push(`id=(${id})`);
  }

  // construct where query if valid
  if (filters.length > 0){
    query += `where ${filters.join("&")};`;
  }

  // pagination
  query += `limit ${limit};`;

  if (page){
    query += `offset ${limit*(page-1)};`;
  }

  if (sort){
    const pgQuery = `
      SELECT game_id
      FROM reviews
      GROUP BY game_id
      ORDER BY COUNT(*) DESC;
    `;

    const orderedGames = await pool.query(pgQuery);

    
  }

  // gets filtered games from IGDB
  let {data} = await instance.post("/games", `${query}`);

  if (data.length === 0){
    throw new BadRequestError(`No game exists with id ${id}`);
  }

  resizeCover(data,coverSize);

  // get avg rating from database

  let pqQuery = `
  SELECT CAST(AVG(rating) AS FLOAT)
  FROM reviews
  WHERE game_id = $1;
`;
  
  data[0].avg_rating = (await pool.query(pqQuery,[id])).rows[0].avg;


  res.status(StatusCodes.OK).send({data});
};

export const getSingleGame = async (req,res) => {
  const {gameId} = req.params;

  const query = `fields name,cover.url,summary,genres.name,first_release_date,involved_companies.publisher, involved_companies.developer,involved_companies.company.name,platforms.name; where id=${gameId};`;

  const {coverSize} = req.query;

  // Gets game with specified id from IGDB
  let {data} = await instance.post("/games", query);

  if (data.length === 0){
    throw new BadRequestError(`No game exists with id ${req.params.id}`);
  }

  if (coverSize){
    resizeCover(data,coverSize);
  }
  
  res.status(StatusCodes.OK).send({data:data[0]});
};

// change default cover size provided by IGDB
const resizeCover = (games,coverSize) => {
  games.forEach(game => {
  const cover = game.cover?.url.replace("thumb", coverSize);
  game.cover = cover;
})};