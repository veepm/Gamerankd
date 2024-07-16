import { StatusCodes } from "http-status-codes";
import instance from "../axios.js"
import { BadRequestError, NotFoundError, UnAuthenticatedError } from "../errors/index.js"
import { pool } from "../database.js";

export const getAllGames = async (req, res) => {
  const {coverSize, search, genres, rating, minYear, maxYear, limit=10, page} = req.query;
  let query = 'fields name,cover.url;';
  let filters = [];
  let response;

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

  query += "sort rating_count desc;";

  if (filters.length > 0){
    query += `where ${filters.join("&")};`;
  }

  // pagination
  query += `limit ${limit};`;
  if (page){
    query += `offset ${limit*(page-1)};`;
  }

  // gets filtered games from IGDB
  response = await instance.post("/games", `${query}`);

  if (coverSize){
    resizeCover(response,coverSize);
  }

  res.status(StatusCodes.OK).send({data:response.data, size:response.data.length});
}

export const getSingleGame = async (req,res) => {
  const query = `fields name,cover.url,summary,genres.name,first_release_date,involved_companies.publisher, involved_companies.developer,involved_companies.company.name,platforms.name; where id=${req.params.id};`;
  const {coverSize} = req.query;

  // Gets game with specified id from IGDB
  let {data} = await instance.post("/games", query);

  if (data.length === 0){
    throw new BadRequestError(`No game exists with id ${req.params.id}`);
  }

  if (coverSize){
    resizeCover(data,coverSize);
  }

  // get reviews and ratings from database

  let pqQuery = `
    SELECT CAST(AVG(rating) AS FLOAT)
    FROM reviews
    WHERE game_id=$1;
  `
  
  data[0].avg_rating = (await pool.query(pqQuery,[req.params.id])).rows[0].avg;
  
  pqQuery = `
    SELECT review_id,rating,review_text,r.created_at,r.updated_at,username
    FROM reviews r,users u
    WHERE r.user_id = u.user_id AND game_id=$1;
  `

  data[0].reviews = (await pool.query(pqQuery,[req.params.id])).rows;

  res.status(StatusCodes.OK).send({data:data[0]});
};

export const addRating = async (req,res) => {

}


// change default cover size provided by IGDB
const resizeCover = (data,coverSize) => {
  data.forEach(game => {
  const cover = game.cover?.url.replace("thumb", coverSize);
  game.cover = cover;
})};