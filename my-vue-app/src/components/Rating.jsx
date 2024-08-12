import { FaStar, FaStarHalf} from "react-icons/fa"
import classes from "./css/rating.module.css"
import { useEffect, useRef, useState, memo } from "react"
import axios from "axios";

const Rating = ({avgRating, isInteractable,  gameId, userRating, setUserRating, size}) => {
  const [hoverRating, setHoverRating] = useState(null);


  const handleClick = async (value) => {
    let config;
    // add if rating does not exists else update
    if (!userRating){
      config = {
        url:`/games/${gameId}/reviews`,
        method: "post",
        data:{rating:value},
        withCredentials:true
      }
    }
    else{
      config = {
        url:`/games/${gameId}/reviews`,
        method: "patch",
        data:{rating:value},
        withCredentials:true
      }
    }

    try {
      await axios(config);
      setUserRating(value);
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className={classes.rating}>
      { [...Array(5)].map((_, i) => {
        const ratingValue = i + 1;

        return (
          isInteractable ?
          (
            <button onClick={()=>handleClick(ratingValue)}>
              <FaStar 
                key={i}
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