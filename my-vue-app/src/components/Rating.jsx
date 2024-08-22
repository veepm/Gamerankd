import { FaStar, FaStarHalf} from "react-icons/fa"
import classes from "./css/rating.module.css"
import { useState, memo } from "react"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/appContext";

const Rating = ({avgRating, isInteractable, gameId, userRating, size}) => {
  const {user} = useAppContext();
  const queryClient = useQueryClient();
  const [hoverRating, setHoverRating] = useState(null);

  const submitRating = (value) => {
    const config = {
      url:`/games/${gameId}/reviews`,
      data:{rating:value},
      withCredentials:true
    };

    // add if rating does not exists else update
    if (!userRating){
      config.method = "post";
    }
    else{
      config.method = "patch";
    }
    return axios(config);
  }

  const submitRatingMutation = useMutation({
    mutationFn: submitRating,
    onMutate: async (value) => {
      await queryClient.cancelQueries({queryKey: ["users", user?.username, "games", gameId]});

      const prevUserInfo = queryClient.getQueryData(["users", user?.username, "games", gameId]);
      
      queryClient.setQueryData(["users", user?.username, "games", gameId], (old) => ({...old, rating:value}));

      return {prevUserInfo};
    },
    onError: (err, value, context) => {
      queryClient.setQueryData(["users", user?.username, "games", gameId], context.prevUserInfo);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["users", user?.username, "games", gameId]});
    }
  });


  return (
    <div className={classes.rating}>
      { [...Array(5)].map((_, i) => {
        const ratingValue = i + 1;

        return (
          isInteractable ?
          (
            <button key={i} onClick={()=>submitRatingMutation.mutate(ratingValue)}>
              <FaStar 
                className={`${classes.star} ${classes.clickable} ${ratingValue <= (hoverRating || userRating) ? classes.active : ""}`} 
                size={size}
                onMouseEnter={() => setHoverRating(ratingValue)}
                onMouseLeave={() => setHoverRating(null)}
              />
            </button>
          )
          :
          (
            <FaStar 
              key={i}
              className={`${classes.star} ${ratingValue <= (avgRating) ? classes.active : ""}`}
              size={size}
            />
          )
        )
      }
      )}     
    </div>
  )
};

export default memo(Rating);