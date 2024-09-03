import { Link, useParams } from "react-router-dom";
import { Rating, Reviews, Select, UserGameInfo } from "../components";
import classes from "./css/singleGame.module.css";
import React, { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PuffLoader from "react-spinners/PuffLoader";
import { IoChevronDownSharp } from "react-icons/io5";

const SingleGame = () => {
  const { gameId } = useParams();

  const gameInfoQuery = useQuery({
    queryKey: ["games", gameId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/games/${gameId}?coverSize=cover_big_2x`
      );
      return data;
    },
  });

  if (gameInfoQuery.isLoading)
    return (
      <div className={classes.loader}>
        <PuffLoader color="var(--primary-400)" />
      </div>
    );

  const game = gameInfoQuery.data;

  const releaseDate = new Date(game.first_release_date * 1000);

  return (
    <div className={classes.container}>
      <div className={classes.cover}>
        <img src={game.cover} />
        <UserGameInfo gameId={gameId} />
      </div>
      <div className={classes.besideCover}>
        <div className={classes.info}>
          <section>
            <div>
              <header className={classes.header}>
                <span className={classes.nameContainer}>
                  <h1>{game.name}</h1>
                  <h4>{releaseDate?.getFullYear()}</h4>
                </span>
                <GameRating
                  avgRating={game.avg_rating}
                  ratingCount={game.rating_count}
                  ratingDistribution={game.rating_distribution}
                />
              </header>
              <GameGenres genres={game.genres} />
            </div>
            <p className={classes.summary}>{game.summary}</p>
          </section>
          <GameDetails
            developers={game.developers}
            publishers={game.publishers}
            platforms={game.platforms}
          />
        </div>
        <Reviews gameId={gameId} />
      </div>
    </div>
  );
};

const GameRating = memo(({ avgRating, ratingCount, ratingDistribution }) => {
  return (
    <span className={classes.avgRating}>
      <span>{avgRating?.toFixed(1) || "Not Rated"}</span>
      <Rating avgRating={avgRating} size="1rem" />
      <IoChevronDownSharp />
      <div className={classes.breakdownContainer}>
        <small>From {ratingCount} user ratings</small>
        {[...Array(5)].map((_, i) => {
          const rating = i + 1;
          const ratio = (ratingDistribution?.[rating] / ratingCount) * 100 || 0;
          return (
            <div key={i} className={classes.breakdownRow}>
              <small>{rating}</small>
              <div
                className={classes.breakdownFill}
                style={{
                  background: `linear-gradient(to right, var(--yellow) ${ratio}%, transparent ${ratio}%)`,
                }}
              >
                <small>{ratio}%</small>
              </div>
            </div>
          );
        })}
      </div>
    </span>
  );
});

const GameGenres = memo(({ genres }) => {
  return (
    <div className={classes.genres}>
      {genres?.map((genre, i) => {
        return (
          <Link
            key={genre.id}
            style={{
              borderRight: i != genres.length - 1 && "1px solid",
              padding: i === 0 ? "0 5px 0 0" : "0 5px",
            }}
            to={`/games/?genres=${genre.id}`}
          >
            {genre.name}
          </Link>
        );
      })}
    </div>
  );
});

const GameDetails = memo((props) => {
  const [selectedTab, setSelectedTab] = useState("developers");

  return (
    <div className={classes.details}>
      <header>
        <button
          onClick={() => setSelectedTab("developers")}
          className={
            classes.option +
            " " +
            (selectedTab === "developers" ? classes.active : "")
          }
        >
          Developers
        </button>
        <button
          onClick={() => setSelectedTab("publishers")}
          className={
            classes.option +
            " " +
            (selectedTab === "publishers" ? classes.active : "")
          }
        >
          Publishers
        </button>
        <button
          onClick={() => setSelectedTab("platforms")}
          className={
            classes.option +
            " " +
            (selectedTab === "platforms" ? classes.active : "")
          }
        >
          Platforms
        </button>
      </header>
      <div>
        {props[selectedTab]?.map((info) => {
          return <div key={info.id}>{info.name}</div>;
        })}
      </div>
    </div>
  );
});

export default SingleGame;
