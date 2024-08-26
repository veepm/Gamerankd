import { memo } from "react";
import { Link } from "react-router-dom";
import {ProfilePic, Rating} from "./index";
import classes from "./css/singleReview.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const SingleReview = memo(({review, showGame}) => {

  const gameQuery = useQuery({
    queryKey: ["games", {id:review.game_id}, "cover"],
    enabled: showGame != null,
    queryFn: async () => {
      const {data} = await axios.get(`games?fields=cover.url,name&coverSize=cover_big&id[]=${review.game_id}`);
      return data;
    }
  })

  if (gameQuery.isLoading) return;
  
  if (gameQuery.isError) console.log(gameQuery.error);

  const game = gameQuery?.data?.games[0];

  return (
    <div key={review.review_id} className={classes.reviewContainer}>
      {showGame ? (
        <Link to={`/games/${game?.id}`}>
          <img src={game?.cover} alt={game.name}/>
        </Link>
      ) : (
        <Link to={`/users/${review.username}`}>
          <ProfilePic username={review.username} size="2rem" fontSize="1rem"/>
        </Link>
      )}
      <div>
        <header>
          <div>
            {showGame ? (
              <Link to={`/games/${game?.id}`}>
                {game?.name}
              </Link>
            ) : (
              <Link to={`/users/${review.username}`}>
                {review.username}
              </Link>
            )}
            <Rating avgRating={review.rating} size={"0.75em"}/>
          </div>
          <small>{(new Date(review.created_at)).toLocaleDateString("en-UK")}</small>
        </header>
        <p>{review.review_text}</p>
      </div>
    </div>
  )
});

export default SingleReview;