import classes from "./css/gamesContainer.module.css";
import Game from "./Game";

const GamesContainer = ({ gamesQuery, gameCount }) => {
  return (
    <div className={classes.gamesContainer}>
      {gamesQuery?.isLoading
        ? [...Array(gameCount)].map((_, i) => {
            return <div key={i} className={classes.placeholder}></div>;
          })
        : gamesQuery?.isSuccess &&
          gamesQuery.data.games.map((game, i) => (
            <Game key={game.id} game={game} />
          ))}
    </div>
  );
};

export default GamesContainer;
