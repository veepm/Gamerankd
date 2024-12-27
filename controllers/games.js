import { StatusCodes } from "http-status-codes";
import instance from "../axios.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { pool } from "../database.js";

export const getGames = async (req, res) => {
  let {
    fields,
    coverSize = "thumb",
    search = "",
    genres = "",
    minYear,
    maxYear,
    limit = 10,
    page = 1,
    id,
    sortBy,
  } = req.query;
  page = Number(page);
  limit = Number(limit);
  let query = "";
  query += `limit ${limit};`;
  // using IGDB rating_count to get more popular games first
  if (fields) {
    query += `fields ${fields};`;
  }

  const offset = limit * (page - 1);
  const filters = [];

  if (genres) {
    filters.push(`genres=(${genres})`); // finds all games with a genre in the list
  }
  if (minYear) {
    const unixTime = Math.floor(new Date(`${minYear}-01-01`).getTime() / 1000);
    filters.push(`first_release_date >= ${unixTime}`);
  }
  if (maxYear) {
    const unixTime = Math.floor(new Date(`${maxYear}-12-31`).getTime() / 1000);
    filters.push(`first_release_date <= ${unixTime}`);
  }
  if (search) {
    filters.push(`name ~ *"${search}"*`);
  }
  // if (id) {
  //   filters.push(`id=(${id})`);
  // }

  if (sortBy === "popularity") {
    query += "sort rating_count desc;";
  } else if (sortBy === "a-z") {
    query += "sort name asc;";
  } else if (sortBy === "z-a") {
    query += "sort name desc;";
  } else if (sortBy === "latest") {
    query += "sort first_release_date desc;";
  } else if (sortBy === "oldest") {
    query += "sort first_release_date asc;";
  }

  let ratingSortedGames;
  let unratedGamesQuery;
  let countQuery;

  if (!id?.length) {
    countQuery = `query games/count "gamesCount" {${
      filters.length > 0 ? "where " + filters.join("&") + ";" : ""
    }};`;
  }
  if (id?.length) {
    filters.push(`id=(${id})`);
  }
  // only want to paginate IGDB request when not using postgres db for rating sorting
  if (sortBy === "lowestRated" || sortBy === "highestRated") {
    query += "sort rating_count desc;";

    ratingSortedGames = await getRatedGames(
      sortBy,
      genres,
      search,
      limit,
      offset,
      id
    );

    if (ratingSortedGames?.game_ids?.length < limit) {
      unratedGamesQuery = query.replace(
        `limit ${limit};`,
        `limit ${limit - ratingSortedGames.game_ids.length};`
      );
      const unratedFilters = [
        ...filters,
        `id!=(${[
          ...ratingSortedGames.game_ids,
          ...ratingSortedGames.previous_game_ids,
        ]})`,
      ].join("&");

      unratedGamesQuery += `where ${unratedFilters};`;
      const ratedPages = Math.ceil(ratingSortedGames.count / limit);
      const extraOffset =
        page - ratedPages > 0
          ? limit > ratingSortedGames.count
            ? limit - ratingSortedGames.count
            : ratingSortedGames.count % limit
          : 0;
      unratedGamesQuery += `offset ${
        limit * Math.max(page - ratedPages - 1, 0) + extraOffset
      };`;
      unratedGamesQuery += "sort rating_count desc;";
    }
  } else {
    query += `offset ${offset};`;
  }

  if (ratingSortedGames?.game_ids?.length) {
    filters.push(`id=(${ratingSortedGames.game_ids})`);
  }

  // construct where query if valid
  if (filters.length > 0) {
    query += `where ${filters.join("&")};`;
  }

  query = `query games "games" {${query}};`;

  if (countQuery) {
    query += countQuery;
  }
  if (unratedGamesQuery) {
    query += `query games "unratedGames"{${unratedGamesQuery}};`;
  }

  const { data } = await instance.post("/multiquery", `${query}`);

  let games = data.find((item) => item.name === "games").result;
  const count =
    data.find((item) => item.name === "gamesCount")?.count || id?.length;
  const unratedGames =
    data.find((item) => item.name === "unratedGames")?.result || [];
  // sort results by rating if neccessary
  if (ratingSortedGames?.game_ids?.length > 0) {
    const gameIndexMap = ratingSortedGames.game_ids.reduce(
      (map, game_id, i) => ((map[game_id] = i), map),
      {}
    );
    games.sort((a, b) => gameIndexMap[a.id] - gameIndexMap[b.id]);
    games = [...games, ...unratedGames];
  } else if (
    (sortBy === "lowestRated" || sortBy === "highestRated") &&
    ratingSortedGames.game_ids
  ) {
    games = [...unratedGames];
  }
  resizeCover(games, coverSize);

  // get avg rating from database for the games returned from IGDB
  const ratingQuery = `
    SELECT game_id, CAST(AVG(rating) AS FLOAT) AS avg_rating
    FROM reviews
    WHERE game_id = ANY($1::int[])
    GROUP BY game_id;
  `;

  const result = await pool.query(ratingQuery, [
    id || games.map((game) => game.id),
  ]);

  const ratingMap = result.rows.reduce(
    (map, game) => (
      (map[game.game_id] = {
        avg_rating: game.avg_rating,
      }),
      map
    ),
    {}
  );

  games.forEach((game, i) => {
    games[i] = {
      ...game,
      avg_rating: null,
      ...ratingMap[game.id],
    };
  });

  res
    .status(StatusCodes.OK)
    .send({ games, count, total_pages: Math.ceil(count / limit) });
};

export const getSingleGame = async (req, res) => {
  const { gameId } = req.params;
  const { coverSize } = req.query;

  let query = `fields name,cover.url,summary,genres.name,first_release_date,involved_companies.publisher,involved_companies.developer,involved_companies.company.name,platforms.name; where id=${gameId};`;

  const { data } = await instance.post("/games", query);

  if (!data[0]) {
    throw new NotFoundError("Game doesn't exist");
  }

  await addGameToDB(
    gameId,
    data[0].genres.map((genre) => genre.id),
    data[0].name
  );

  resizeCover(data, coverSize);
  formatCompanies(data);

  const ratingQuery = `
    WITH ratings AS (
      SELECT game_id,rating, COUNT(rating), SUM(rating)
      FROM reviews
      WHERE game_id=$1
      GROUP BY game_id, rating
    )

    SELECT CAST(SUM(sum)/SUM(count) AS FLOAT) AS avg_rating, JSON_OBJECT_AGG(rating, count) as rating_distribution, CAST(SUM(count) AS INT) as rating_count
    FROM ratings
    GROUP BY game_id;
  `;

  const result = await pool.query(ratingQuery, [gameId]);

  const game = {
    ...data[0],
    avg_rating: 0,
    rating_count: 0,
    rating_distribution: null,
    ...result.rows[0],
  };

  res.status(StatusCodes.OK).json(game);
};

const getRatedGames = async (
  sortBy,
  genres = "",
  search = "",
  limit,
  offset,
  gameIds
) => {
  const order = sortBy === "lowestRated" ? "ASC" : "DESC";
  let filter = "";
  let values = [limit, offset, `{${genres}}`, `%${search}%`];

  if (gameIds?.length > 0) {
    filter = "AND r.game_id = ANY($5::int[])";
    values.push(gameIds);
  }

  // can use non parameterized query for order here since it can't be injected with something else
  const ratedGamesQuery = `
    SELECT (ARRAY_AGG(game_id))[1+$2:$1+$2] AS game_ids, CAST(COUNT(game_id) AS INT), (ARRAY_AGG(game_id))[1:$2] AS previous_game_ids
    FROM (
        SELECT r.game_id
        FROM reviews r
        JOIN viewed_games vg ON r.game_id = vg.game_id
        WHERE ($3 && vg.genres OR $3 <@ vg.genres) AND UPPER(title) LIKE UPPER($4) ${filter}
        GROUP BY r.game_id
        ORDER BY AVG(rating) ${order}, COUNT(*) DESC
    );
  `;

  const ratedGames = (await pool.query(ratedGamesQuery, values)).rows[0];

  return ratedGames;
};

const addGameToDB = async (gameId, gameGenres, gameName) => {
  const gameQuery = `
      INSERT INTO viewed_games
      VALUES ($1,$2,$3)
      ON CONFLICT (game_id)
      DO UPDATE
        SET genres = EXCLUDED.genres,
        title = EXCLUDED.title
        WHERE viewed_games.genres <> EXCLUDED.genres OR viewed_games.title <> EXCLUDED.title;
    `;

  await pool.query(gameQuery, [gameId, gameGenres, gameName]);
};

const formatCompanies = (games) => {
  games.forEach((game) => {
    game.publishers = game.involved_companies?.flatMap((company) => {
      if (company.publisher) {
        return { id: company.company.id, name: company.company.name };
      }
      return [];
    });
    game.developers = game.involved_companies?.flatMap((company) => {
      if (company.developer) {
        return { id: company.company.id, name: company.company.name };
      }
      return [];
    });
    delete game.involved_companies;
  });
};

// change default cover size provided by IGDB
const resizeCover = (games, coverSize) => {
  games.forEach((game) => {
    const cover = game.cover?.url.replace("thumb", coverSize);
    game.cover = cover;
  });
};

var startTime, endTime;
function start() {
  startTime = performance.now();
}

function end() {
  endTime = performance.now();
  var timeDiff = endTime - startTime; //in ms

  console.log(timeDiff + " m seconds");
}
