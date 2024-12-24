import Game from "./Game";

const StackedGames = ({ games }) => {
  return (
    <div>
      {games.map((game) => {
        return (
          <Game game={game}/>
        );
      })}
      ;
    </div>
  );
};
export default StackedGames;
