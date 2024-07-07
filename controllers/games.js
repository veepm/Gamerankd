import instance from "../axios.js"
import CustomAPIError from "../errors/custom-api.js";
import { BadRequestError, NotFoundError, UnAuthenticatedError } from "../errors/index.js"

export const getAllGames = async (req, res) => {
  const {coverSize, search, genres, rating, minYear, maxYear, limit=10, page} = req.query;
  let query = 'fields name,cover.url;';
  let filters = [];
  let response;

  if (search){
    query += `search "${search}";`;
  }

  if (genres){
    const genresList = genres.split(",").map(genre =>`"${genre}"`).join(","); // surround each genre with ""
    filters.push(`genres.name=(${genresList})`); // finds all games with a genre in the list
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
  if (filters.length > 0){
    query += `where ${filters.join("&")};`;
  }

  // pagination
  query += `limit ${limit};`;
  if (page){
    query += `offset ${limit*(page-1)};`;
  }

  // gets filtered games from IGDB
  try {
    response = await instance.post("/games", `${query}`);
  } catch (error) {
    const customError = new CustomAPIError("IGDB request failed. " + error.message);
    customError.statusCode = error.response.status;
    throw customError;
  }

  if (coverSize){
    resizeCover(response,coverSize);
  }

  res.send({data:response.data, size:response.data.length});
}

export const getSingleGame = async (req,res) => {
  const {coverSize} = req.query;
  let response;

  // Gets game with specified id from IGDB
  try {
    response = await instance.post("/games", `fields name,cover.url,summary,genres.name,first_release_date,involved_companies.publisher, involved_companies.developer,involved_companies.company.name,platforms.name; where id=${req.params.id};`);
  } catch (error) {
    const customError = new CustomAPIError("IGDB request failed. " + error.message);
    customError.statusCode = error.response.status;
    throw customError;
  }

  if (response.data.length === 0){
    throw new BadRequestError(`No game exists with id ${req.params.id}`);
  }

  if (coverSize){
    resizeCover(response,coverSize);
  }

  // get reviews and ratings from database
  
  res.send(response.data);
};


const resizeCover= (response,coverSize) => {
  response.data.forEach(game => {
  const cover = game.cover?.url.replace("thumb", coverSize);
  game.cover = cover;
})};