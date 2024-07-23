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
        <img title={game.name} src={game.cover ? `https:${game.cover}` : "../vite.svg"}/>
      </div>
    </section>
  )
}
export default Games