import { FaStar, FaStarHalf} from "react-icons/fa"
import classes from "./css/rating.module.css"
import { useEffect, useRef, useState } from "react"
import axios from "axios";

const Rating = ({avgRating, isInteractable,  gameId, userRating, className, size}) => {
  const [rating, setRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const ref = useRef(null);

  useEffect(()=>{
    setRating(userRating);
  },[]);

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
        url:`/reviews/games/${gameId}`,
        method: "patch",
        data:{rating:value},
        withCredentials:true
      }
    }

    try {
      await axios(config);
      setRating(value);
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className={`${classes.rating} ${className}`}>
      { [...Array(5)].map((star, i) => {
        const ratingValue = i + 1;

        return (
          isInteractable ?
          (
            <FaStar 
              key={i}
              className={classes.star} 
              size={size}
              color={ratingValue <= (hoverRating || rating) ? "#fcba03" : "#b0b3b8"}
              onMouseEnter={() => setHoverRating(ratingValue)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={()=>handleClick(ratingValue)}
            />
          )
          :
          (
            <FaStar 
              key={i}
              size={size}
              color={ratingValue <= (avgRating) ? "#fcba03" : "#b0b3b8"} 
            />
          )
        )
      }
      )}     
    </div>
  )
}
export default Rating