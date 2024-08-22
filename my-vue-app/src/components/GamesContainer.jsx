import { useNavigate } from "react-router-dom";
import classes from "./css/gamesContainer.module.css";

const GamesContainer = ({gamesQuery,gameCount}) => {
  const navigate = useNavigate();

  return (
    <div className={classes.gamesContainer}>
      {gamesQuery?.isLoading ?
      (
        [...Array(gameCount)].map((placeholder,i) =>{
          return <div key={i} className={classes.placeholder}></div>;
        })
      )
      :
      (
        gamesQuery?.isSuccess && gamesQuery.data.games.map(game => {
          return (
            <div key={game.id} className={classes.game} onClick={()=>navigate(`/games/${game.id}`)}>
              <img 
                title={game.name}
                className={classes.cover}
                src={game.cover ? `https:${game.cover}` : "../vite.svg"}
                loading="lazy"
              />
              <img
                className={classes.background}
                src={game.cover ? `https:${game.cover}` : "../vite.svg"}
                loading="lazy"
              />
            </div>
          );
          })
        )}
    </div>
  )
};

export default GamesContainer;