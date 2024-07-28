import {useNavigate} from "react-router-dom";
import classes from "./css/games.module.css"

const Games = ({game}) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games/${game.id}`);
  }
  return (
        <img 
          className={classes.game}
          title={game.name} 
          src={game.cover ? `https:${game.cover}` : "../vite.svg"}
          onClick={handleClick}
        />
  )
}
export default Games