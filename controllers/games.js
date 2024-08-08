import { StatusCodes } from "http-status-codes";
import instance from "../axios.js"
import { BadRequestError } from "../errors/index.js"
import { pool } from "../database.js";

export const getGames = async (req, res) => {
  const {fields, coverSize="thumb", search, genres, rating, minYear, maxYear, limit=10, page, id, sortBy} = req.query;
  // let query = "fields name,cover.url,summary,genres.name,first_release_date,involved_companies.publisher, involved_companies.developer,involved_companies.company.name,platforms.name;";
  let query = "";
  // using IGDB rating_count to get more popular games first
  if (fields){
    query += `fields ${fields};`; 
  }

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

  // IGDB pagination
  query += `limit ${limit};`;

  // only want to paginate IGDB request when not using postgres db for rating sorting
  if (page && !(sortBy === "lowestRated" || sortBy === "highestRated")){
    query += `offset ${limit*(page-1)};`;
  }
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
  if (sortBy === "lowestRated" || sortBy === "highestRated"){
    const order = sortBy === "lowestRated" ? "ASC" : "DESC";
    
    const offset = limit*(page-1);
    // can use non parameterized query for order here since it can't be injected with something else
    const pgQuery = `
      SELECT game_id
      FROM reviews
      GROUP BY game_id
      ORDER BY AVG(rating) ${order}, COUNT(*) DESC
      OFFSET $1
      LIMIT $2;
    `;
    // const pgQuery = `
    //   SELECT game_id
    //   FROM reviews
    //   GROUP BY game_id
    //   ORDER BY COUNT(*) ASC
    //   OFFSET 0
    //   LIMIT 10;
    // `;

    ratingSortedGames = await pool.query(pgQuery,[offset,limit]);

    if (ratingSortedGames.rowCount > 0){
      filters.push(`id=(${ratingSortedGames.rows.map(game => game.game_id)})`);
    }
    else if (page > 1){
      const result = await pool.query("SELECT DISTINCT game_id FROM reviews;");
      start()
      
      const ratedPages = Math.ceil(result.rowCount/limit);
      const extraOffset = limit - (result.rowCount % limit);
      
      query += `offset ${limit*(page-ratedPages-1) + extraOffset};`;
      query += "sort rating_count desc;"; // for games not rated yet
      filters.push(`id!=(${result.rows.map(game => game.game_id)})`);
      end()
    }
  }

  // construct where query if valid
  if (filters.length > 0){
    query += `where ${filters.join("&")};`;
  }

  // gets filtered games from IGDB
  const {data} = await instance.post("/games", `${query}`);

  if (ratingSortedGames?.rowCount > 0){
    start()
    const idMap = ratingSortedGames.rows.reduce((map,game,i) => (map[game.game_id] = i, map),{});
    data.sort((a,b) => idMap[a.id] - idMap[b.id]);
    // data.sort((a,b) => ratingSortedGames.rows.findIndex(game => game.game_id === a.id) - ratingSortedGames.rows.findIndex(game => game.game_id === b.id));
    end()

    // not enough games provided since postgres can only return rated games
    if (ratingSortedGames.rowCount < limit){
      query = query.replace(`limit ${limit};`, `limit ${limit-ratingSortedGames.rowCount};`);
      query += "sort rating_count desc;"; // for games not rated yet
      query = query.replace(`id=`,`id!=`);

      const {data:extraGames} = await instance.post("/games", `${query}`);
      data.push(...extraGames);
    }
  }

  formatCompanies(data);
  resizeCover(data,coverSize);

  // get avg rating from database for the games returned from IGDB
  const ratingQuery = `
    SELECT game_id, CAST(AVG(rating) AS FLOAT) AS avg_rating, COUNT(*) as rating_count
    FROM reviews
    WHERE game_id = ANY($1::int[])
    GROUP BY game_id;
  `;

  const result = await pool.query(ratingQuery,[id]);

  const ratingMap = result.rows.reduce((map,game) => (map[game.game_id] = {avg_rating:game.avg_rating,rating_count:game.rating_count}, map),{});
  data.forEach((game,i) => {
    data[i] = {...game, ...ratingMap[game.id]};
  })
  res.status(StatusCodes.OK).send({games:data});
};

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