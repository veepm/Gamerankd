import { StatusCodes } from "http-status-codes";
import instance from "../axios.js"
import { BadRequestError } from "../errors/index.js"
import { pool } from "../database.js";

export const getGames = async (req, res) => {
  let {fields, coverSize="thumb", search, genres, rating, minYear, maxYear, limit=10, page=1, id, sortBy} = req.query;
  page = Number(page);
  limit = Number(limit);
  let query = "";

  // using IGDB rating_count to get more popular games first
  if (fields){
    if (fields.includes("avg_rating")){
      fields = fields.replace("avg_rating");
    }
    query += `fields ${fields};`; 
  }

  const offset = limit*(page-1);

  const filters = getFilters(genres,minYear,maxYear,search,id);

  if (sortBy === "popularity"){
    query += "sort rating_count desc;";
  }
  else if (sortBy === "a-z"){
    query += "sort name asc;";
  }
  else if (sortBy === "z-a"){
    query += "sort name desc;";
  }
  else if (sortBy === "latest"){
    query += "sort first_release_date desc;";
  }
  else if (sortBy === "oldest"){
    query += "sort first_release_date asc;";
  }

  let ratingSortedGames;
  let sortedGamesCount;
  let unratedGamesQuery;
  // only want to paginate IGDB request when not using postgres db for rating sorting
  if (!(sortBy === "lowestRated" || sortBy === "highestRated")){
    query += `offset ${offset};`;
    query += `limit ${limit};`;
  }
  else{
    const order = sortBy === "lowestRated" ? "ASC" : "DESC";
    
    // can use non parameterized query for order here since it can't be injected with something else
    const pgQuery = `
      SELECT game_id
      FROM reviews
      GROUP BY game_id
      ORDER BY AVG(rating) ${order}, COUNT(*) DESC
      LIMIT $1
      OFFSET $2;
    `;

    ratingSortedGames = await pool.query(pgQuery,[limit,offset]);

    sortedGamesCount = ratingSortedGames.rowCount;
    const sortedGamesId = ratingSortedGames?.rows.map(game => game.game_id);

    if (sortedGamesCount > 0){

      // not enough games provided since postgres can only return rated games
      if (sortedGamesCount < limit){
        unratedGamesQuery = query.replace(`limit ${limit};`, `limit ${limit-sortedGamesCount};`);
        unratedGamesQuery += "sort rating_count desc;"; // for games not rated yet
        const unratedFilters = [...filters, (`id!=(${sortedGamesId});`)].join("&");
        unratedGamesQuery += `where ${unratedFilters}`;
      }
      filters.push(`id=(${sortedGamesId})`);
    }
    else{
      // TODO: make sure that works when reviews count is 0
      const ratedPages = Math.ceil(sortedGamesCount/limit);
      const extraOffset = limit - (result.rowCount % limit);
      query += `offset ${limit*(page-ratedPages-1) + extraOffset};`;
      query += "sort rating_count desc;"; // for games not rated yet
      filters.push(`id!=(${result.rows.map(game => game.game_id)})`);
    }
  }

  // construct where query if valid
  if (filters.length > 0){
    query += `where ${filters.join("&")};`;
  }

  query = `query games "games" {${query}};`

  if (!id){
    query += `query games/count "gamesCount"{};`
  }
  if (unratedGamesQuery){
    query += `query games "unratedGames"{${unratedGamesQuery}};`;
  }

  const {data} = await instance.post("/multiquery", `${query}`);

  let games = data.find((item) => item.name === "games").result;
  const count = data.find((item) => item.name === "gamesCount")?.count;

  // sort results by rating if neccessary
  if (sortedGamesCount > 0){
    const idMap = ratingSortedGames.rows.reduce((map,game,i) => (map[game.game_id] = i, map),{});
    games.sort((a,b) => idMap[a.id] - idMap[b.id]);
    
    const ratedGames = games.slice(offset, offset+Number(limit));
    let unratedGames = data.find((item) => item.name === "unratedGames")?.result || [];
    
    if (ratedGames.length < limit){
      unratedGames = unratedGames.slice()
    }
    // TODO: games not selected when filters included because of postgres limit
    games = [...ratedGames, ...unratedGames];
  }
  else{
    games = [...games];
  }

  formatCompanies(games);
  resizeCover(games,coverSize);

  // get avg rating from database for the games returned from IGDB
  const ratingQuery = `
    SELECT game_id, CAST(AVG(rating) AS FLOAT) AS avg_rating, COUNT(*) as rating_count
    FROM reviews
    WHERE game_id = ANY($1::int[])
    GROUP BY game_id;
  `;

  const result = await pool.query(ratingQuery,[id]);

  const ratingMap = result.rows.reduce((map,game) => (map[game.game_id] = {avg_rating:game.avg_rating,rating_count:game.rating_count}, map),{});
  games.forEach((game,i) => {
    games[i] = {...game, ...ratingMap[game.id]};
  })

  res.status(StatusCodes.OK).send({games,count,last_page: Math.ceil(count / limit)});
};

const getFilters = (genres,minYear,maxYear,search,id) => {
  const filters = [];

  if (genres){
    filters.push(`genres=(${genres})`); // finds all games with a genre in the list
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

  return filters;
}


const formatCompanies = (games) => {
  games.forEach(game => {
    const publisherIds = game.involved_companies?.map(company => company.company.id);

    game.publishers = game.involved_companies?.flatMap((company) => {
      if (company.publisher){
        return {id: company.company.id, name: company.company.name};
      }
      return [];
    });
    game.developers = game.involved_companies?.flatMap((company) => {
      if (company.developer){
        return {id: company.company.id, name: company.company.name};
      }
      return [];
    });
    delete game.involved_companies;
  })
};

// change default cover size provided by IGDB
const resizeCover = (games,coverSize) => {
  games.forEach(game => {
  const cover = game.cover?.url.replace("thumb", coverSize);
  game.cover = cover;
})};

var startTime, endTime;

function start() {
  startTime = performance.now();
};

function end() {
  endTime = performance.now();
  var timeDiff = endTime - startTime; //in ms 

  console.log(timeDiff + " m seconds");
}