import { Link, useParams } from "react-router-dom"
import {GameDetails, Loading, Rating, Review, UserGameInfo} from "../components/index"
import useFetch from "../useFetch";
import classes from "./css/singleGame.module.css";


const SingleGame = () => {
  const {gameId} = useParams();

  const url = `/games?fields=name,cover.url,summary,genres.name,first_release_date,involved_companies.publisher,involved_companies.developer,involved_companies.company.name,platforms.name&coverSize=cover_big_2x&id[]=${gameId}`;

  const {data,isLoading:gameInfoLoading,error} = useFetch({method:"get",url});
  
  if (gameInfoLoading){
    return <Loading></Loading>;
  }

  
  const game = data.games[0];

  const releaseDate = new Date(game.first_release_date * 1000);


  return (
    <div className={classes.container}>
      <div className={classes.game}>
        <div>
          <img src={game.cover}/>
          <UserGameInfo gameId={gameId}/>
        </div>
        <div className={classes.info}>
          <div className={classes.headerContainer}>
            <div>
              <div className={classes.header}>
                <h1>{game.name}</h1>
                <h4>{releaseDate?.getFullYear()}</h4>
              </div>
              <div>
                {game.genres?.map((genre,i) => {
                  return <Link
                          key={genre.id} 
                          style={{borderRight: i!=game.genres.length-1 && "1px solid",  padding:"0 5px", textDecoration:"none", color:"inherit"}}
                          to={`/games/?genres=${genre.id}`}
                        >
                          {genre.name}
                        </Link>
                })}
              </div>
            </div>
            <div className={classes.rating}>
              <span>{game.avg_rating?.toFixed(1) || "Not Rated"}</span>
              <Rating avgRating={game.avg_rating} size="1rem"/>
            </div>
          </div>

          <p>{game.summary}</p>
        </div>
        <GameDetails developers={game.developers} publishers={game.publishers} platforms={game.platforms}/>
      </div>
      <Review gameId={gameId}/>
    </div>
  )
};

export default SingleGame;