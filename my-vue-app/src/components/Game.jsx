import { useNavigate } from "react-router-dom";
import classes from "./css/game.module.css";

const Game = ({ game }) => {
  const navigate = useNavigate();

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
    </div>
  );
};
export default Game;
