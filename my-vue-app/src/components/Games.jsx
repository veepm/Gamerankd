import {useNavigate} from "react-router-dom";
import classes from "./css/games.module.css"

const Games = ({game}) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games/${game.id}`);
  }

  return (
    <section className={classes.game} onClick={()=>handleClick()}>
      <div className={classes.cover}>
        <img src={game.cover ? `https:${game.cover}` : "../vite.svg"}/>
      </div>
      <div className={classes.name}>
        <h4 title={game.name}>{game.name}</h4>
      </div>
    </section>
  )
}
export default Games