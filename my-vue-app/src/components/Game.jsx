import { useNavigate } from "react-router-dom";
import classes from "./css/game.module.css";
import Rating from "./Rating";

const Game = ({ game }) => {
  const navigate = useNavigate();
 // TODO: Use lower res photo for background
  return (
    <div className={classes.game} onClick={() => navigate(`/games/${game.id}`)}>
      {game.cover ? (
        <>
          <img
            title={game.name}
            className={classes.cover}
            src={`https:${game.cover}`}
            loading="lazy"
          />
          <img
            className={classes.background}
            src={`https:${game.cover}`}
            loading="lazy"
          />
        </>
      ) : (
        <div>{game.name}</div>
      )}
      <div className={classes.rating}>
        <Rating avgRating={game.avg_rating} size={"1.2rem"}/>
      </div>
    </div>
  );
};
export default Game;
