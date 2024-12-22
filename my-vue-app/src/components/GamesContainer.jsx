import classes from "./css/gamesContainer.module.css";
import Game from "./Game";

const GamesContainer = ({ games, gameCount, isLoading, resize = true }) => {
  return (
    <div
      className={classes.gamesContainer}
      style={{ gridTemplateColumns: !resize && "repeat(auto-fit,9.5rem)" }}
    >
      {isLoading
        ? [...Array(gameCount)].map((_, i) => {
            return <div key={i} className={classes.placeholder}></div>;
          })
        : games?.map((game, i) => <Game key={game.id} game={game} />)}
    </div>
  );
};

export default GamesContainer;
