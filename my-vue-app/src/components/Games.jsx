import {useNavigate} from "react-router-dom";

const Games = ({game}) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games/${game.id}`);
  }

  return (
    <section className="game" onClick={()=>handleClick()}>
      <div className="image">
        <img src={game.cover ? `https:${game.cover}` : "../vite.svg"}/>
      </div>
      <div className="name">
        <h4>{game.name}</h4>
      </div>
    </section>
  )
}
export default Games