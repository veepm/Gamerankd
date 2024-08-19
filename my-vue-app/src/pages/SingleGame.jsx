import { Link, useParams } from "react-router-dom"
import {GameDetails, Loading, Rating, Reviews, UserGameInfo} from "../components/index"
import classes from "./css/singleGame.module.css";
import { useAppContext } from "../context/appContext";
import { memo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const SingleGame = () => {
  const {user} = useAppContext();
  const {gameId} = useParams();

  const [userRating, setUserRating] = useState(null); // for rerendering user rating after review
  
  const userInfoQuery = useQuery({
    queryKey: ["users", user?.username, "games", gameId],
    enabled: user != null,
    queryFn: async () => {
      const {data} = await axios.get(`/users/${user.username}/games/${gameId}`);
      setUserRating(data.rating);
      return data;
    }
  });

  const gameInfoQuery = useQuery({
    queryKey: ["games", gameId],
    queryFn: async () => {
      const {data} = await axios.get(`/games?fields=name,cover.url,summary,genres.name,first_release_date,involved_companies.publisher,involved_companies.developer,involved_companies.company.name,platforms.name&coverSize=cover_big_2x&id[]=${gameId}`);
      return data;
    }
  });
  
  if (userInfoQuery.isLoading || gameInfoQuery.isLoading){
    return <Loading></Loading>;
  }

  const game = gameInfoQuery.data?.games[0];

  const releaseDate = new Date(game.first_release_date * 1000);

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.cover}>
          <img src={game.cover}/>
          <UserGameInfo gameId={gameId} userPlayed={userInfoQuery.data?.played} userWishlisted={userInfoQuery.data?.wishlisted} userRating={userRating} setUserRating={setUserRating}/>
        </div>
      </div>
      <div className={classes.besideCover}>
        <div className={classes.info}>
          <section>
            <div>
              <header className={classes.header}>
                <h1>{game.name}</h1>
                <h4>{releaseDate?.getFullYear()}</h4>
                <div className={classes.avgRating}>
                  <span>{game.avg_rating?.toFixed(1) || "Not Rated"}</span>
                  <Rating avgRating={game.avg_rating} size="1rem"/>
                </div>
              </header>
              <GameGenres genres={game.genres}/>
            </div>
            <p>{game.summary}</p>
          </section>
          <GameDetails developers={game.developers} publishers={game.publishers} platforms={game.platforms}/>
        </div>
        <Reviews gameId={gameId} userReviewed={userInfoQuery.data?.review_text} userRating={userRating} setUserRating={setUserRating}/>
      </div>
    </div>
  )
};

const GameGenres = memo(({genres}) => {
  return (
    <div>
      {genres?.map((genre,i) => {
        return <Link
                key={genre.id} 
                style={{borderRight: i!=genres.length-1 && "1px solid",  padding: i===0 ? "0 5px 0 0" : "0 5px"}}
                to={`/games/?genres=${genre.id}`}
              >
                {genre.name}
              </Link>
      })}
    </div>
  )
});

export default SingleGame;