import { useParams } from "react-router-dom"
import {Loading, Rating, Review, UserGameInfo} from "../components/index"
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
    <div>
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
                <h4>{releaseDate.getFullYear()}</h4>
              </div>
              <div>
                {game.genres?.map((genre,i) => {
                  return <span key={genre.id} style={{borderRight: i!=game.genres.length-1 && "1px solid",  padding:"0 5px"}}>{genre.name}</span>
                })}
              </div>
            </div>
            <div className={classes.rating}>
              <span>{game.avg_rating?.toFixed(1) || "Not Rated"}</span>
              <Rating className={classes.avgRating} avgRating={game.avg_rating} size={"1rem"}/>
            </div>
          </div>

          <p>{game.summary}</p>


          <div>
            <h4>Publishers</h4>
            {game.publishers?.map((company) => <div>{company.name}</div>)}
          </div>
          <div>
            <h4>Developers</h4>
            {game.developers?.map((company) => <div>{company.name}</div>)}
          </div>
          <div>
            <h4>Platforms</h4>
            {game.platforms?.map((platform) => <div>{platform.name}</div>)}
          </div>
        </div>

      </div>
      <Review gameId={gameId}/>
    </div>
  )
}
export default SingleGame