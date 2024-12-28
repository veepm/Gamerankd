import classes from "./css/stackedGames.module.css";

const StackedGames = ({ games }) => {
  return (
    <div className={classes.container}>
      {games?.map((game, i) => {
        return (
          <div className={classes.cover} style={{ zIndex: 5 - i }} key={game.id}>
            <img src={`https:${game.cover}`} />
          </div>
        );
      })}
    </div>
  );
};
export default StackedGames;
