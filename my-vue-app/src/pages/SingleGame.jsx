import { Link, useParams } from "react-router-dom"
import {Rating, Reviews, UserGameInfo} from "../components/index"
import classes from "./css/singleGame.module.css";
import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PuffLoader from "react-spinners/PuffLoader";

const SingleGame = () => {
  const {gameId} = useParams();

  const gameInfoQuery = useQuery({
    queryKey: ["games", {id:gameId}],
    queryFn: async () => {
      const {data} = await axios.get(`/games?fields=name,cover.url,summary,genres.name,first_release_date,involved_companies.publisher,involved_companies.developer,involved_companies.company.name,platforms.name&coverSize=cover_big_2x&id[]=${gameId}`);
      return data;
    }
  });
  
  if (gameInfoQuery.isLoading) return <div className={classes.loader}><PuffLoader color="white"/></div>;

  const game = gameInfoQuery.data?.games[0];

  const releaseDate = new Date(game.first_release_date * 1000);

  return (
    <div className={classes.container}>
        <div className={classes.cover}>
          <img src={game.cover}/>
          <UserGameInfo gameId={gameId}/>
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
        <Reviews gameId={gameId}/>
      </div>
    </div>
  )
};

const GameGenres = memo(({genres}) => {
  return (
    <div className={classes.genres}>
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

const GameDetails = memo((props) => {
  const [selectedTab, setSelectedTab] = useState("developers");

  return (
    <div className={classes.details}>
      <header>
        <button onClick={()=>setSelectedTab("developers")}>
          Developers
        </button>
        <button onClick={()=>setSelectedTab("publishers")}>
          Publishers
        </button>
        <button onClick={()=>setSelectedTab("platforms")}>
          Platforms
        </button>
      </header>
      <div>
        {props[selectedTab]?.map((info => {
          return <div key={info.id}>{info.name}</div>;
        }))}
      </div>
    </div>
  )
});

export default SingleGame;