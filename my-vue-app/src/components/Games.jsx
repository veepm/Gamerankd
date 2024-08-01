import {useNavigate} from "react-router-dom";
import classes from "./css/games.module.css"

const Games = ({game}) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games/${game.id}`);
  }
  
  return (
    <div className={classes.game} onClick={handleClick}>
      <img 
        title={game.name} 
        className={classes.cover}
        src={game.cover ? `https:${game.cover}` : "../vite.svg"}
      />
      <img 
        style={{position:"absolute", width:"100%", height:"100%", objectFit:"cover",zIndex:-10,filter:"blur(5px)"}}
        src={game.cover ? `https:${game.cover}` : "../vite.svg"}
      />
    </div>
  )
}
export default Games