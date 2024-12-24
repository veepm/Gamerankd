import useWindowDimensions from "../useWindowDimensions";
import classes from "./css/stackedGames.module.css";

const StackedGames = ({ games }) => {
  return (
    <div className={classes.container}>
      {games?.map((game, i) => {
        return (
          <div className={classes.cover} style={{ zIndex: 5 - i }}>
            <img src={`https:${game.cover}`} />
          </div>
        );
      })}
    </div>
  );
};
export default StackedGames;
