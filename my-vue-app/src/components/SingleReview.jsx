import { memo } from "react";
import { Link } from "react-router-dom";
import { ProfilePic, Rating } from "./index";
import classes from "./css/singleReview.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const SingleReview = ({ review, showGame }) => {
  const gameQuery = useQuery({
    queryKey: ["games", { id: review.game_id }, "cover"],
    enabled: showGame != null,
    queryFn: async () => {
      const { data } = await axios.get(
        `games?fields=cover.url,name&coverSize=cover_big&id[]=${review.game_id}`
      );
      return data;
    },
  });

  if (gameQuery.isLoading) return;

  if (gameQuery.isError) console.log(gameQuery.error);

  const game = gameQuery?.data?.games[0];

  return (
    <div key={review.review_id} className={classes.reviewContainer}>
      {showGame ? (
        <Link to={`/games/${game?.id}`}>
          <img src={game?.cover} alt={game?.name} className={classes.cover} />
        </Link>
      ) : (
        <Link to={`/users/${review.username}`}>
          <ProfilePic username={review.username} className={classes.pic}/>
        </Link>
      )}
      <div>
        <header>
          <div>
            {showGame ? (
              <Link to={`/games/${game?.id}`}>{game?.name}</Link>
            ) : (
              <Link to={`/users/${review.username}`}>{review.username}</Link>
            )}
            <Rating avgRating={review.rating} size={"0.75em"} />
          </div>
          {!showGame && <small>
            {review.created_at === review.updated_at
              ? new Date(review.created_at).toLocaleDateString("en-UK")
              : "Edited " +
                new Date(review.updated_at).toLocaleDateString("en-UK")}
          </small>}
        </header>
        <p>{review.review_text}</p>
      </div>
    </div>
  );
};

export default memo(SingleReview);
