import { FaStar, FaStarHalf} from "react-icons/fa"
import classes from "./css/rating.module.css"
import { useEffect, useRef, useState, memo } from "react"
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const Rating = ({avgRating, isInteractable,  gameId, userRating, setUserRating, size}) => {
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
    axios(config);
  }

  const submitRatingMutation = useMutation({
    mutationFn: submitRating,
    onSuccess: (data, value) => setUserRating(value)
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