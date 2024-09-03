import { useQuery } from "@tanstack/react-query";
import {
  GamesContainer,
  PageButton,
  Sort,
  SearchBar,
  GenresFilter,
} from "../components";
import classes from "./css/allGames.module.css";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";

const sortOptions = [
  "popularity",
  "a-z",
  "z-a",
  "highestRated",
  "lowestRated",
  "latest",
  "oldest",
];

const options = [
  {
    options: [{ label: "Popularity", value: "popularity" }],
  },
  {
    group: "Title",
    options: [
      { label: "A-Z", value: "a-z" },
      { label: "Z-A", value: "z-a" },
    ],
  },
  {
    group: "Average Rating",
    options: [
      { label: "Highest Rated", value: "highestRated" },
      { label: "Lowest Rated", value: "lowestRated" },
    ],
  },
  {
    group: "Year Made",
    options: [
      { label: "Latest", value: "latest" },
      { label: "Oldest", value: "oldest" },
    ],
  },
];

const Games = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { username, listName } = useParams();

  let filteredGenres = searchParams.get("genres")?.split(",").map(Number) || [];
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  let sortBy = searchParams.get("sortBy");

  if (!sortOptions.includes(sortBy)) {
    sortBy = sortOptions[0];
  }

  if (filteredGenres.includes(NaN)) {
    filteredGenres = filteredGenres.filter((genre) => !isNaN(genre));
  }

  let listGamesUrl = `/users/${username}/lists/${listName}?search=${search}&genres=${filteredGenres}`;
  let gameUrl = `/games?coverSize=cover_big_2x&limit=48&page=${page}&sortBy=${sortBy}&fields=cover.url,name`;

  if (search) {
    gameUrl += `&search=${search}`;
  }
  if (filteredGenres.length > 0) {
    gameUrl += `&genres=${filteredGenres}`;
  }

  const listGamesQuery = useQuery({
    queryKey: [
      "users",
      username,
      "lists",
      listName,
      { genres: filteredGenres },
      { search },
    ],
    enabled: username != null && listName != null, // Only run for lists route
    queryFn: async () => {
      const { data } = await axios.get(listGamesUrl);
      return data;
    },
  });

  if (listGamesQuery?.data?.games?.length > 0) {
    listGamesQuery.data.games.forEach((id) => {
      gameUrl += `&id[]=${id}`;
    });
  }

  const allGamesQuery = useQuery({
    queryKey: [
      "games",
      { genres: filteredGenres },
      { page },
      { search },
      { sortBy },
      { ids: listGamesQuery?.data?.games },
    ],
    enabled:
      (!username && !listName) || listGamesQuery?.data?.games?.length > 0,
    queryFn: async () => {
      const { data } = await axios.get(gameUrl);
      return data;
    },
  });

  return (
    <div className={classes.container}>
      <header>
        {!username && !listName ? (
          <SearchBar placeholder="Search For Games By Title" />
        ) : (
          <h2>
            {username +
              "'s " +
              listName.charAt(0).toUpperCase() +
              listName.slice(1)}
          </h2>
        )}
        <div className={classes.filters}>
          <Sort options={options} />
          <GenresFilter />
        </div>
      </header>
      {!listGamesQuery.isLoading && (
        <GamesContainer
          gamesQuery={allGamesQuery}
          gameCount={listGamesQuery.data?.games?.length || 48}
        />
      )}
      {!listGamesQuery.isLoading && (
        <PageButton
          totalPages={allGamesQuery.data?.total_pages}
          siblingCount={2}
        />
      )}
    </div>
  );
};

export default Games;
