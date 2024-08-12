import { useState, memo, useRef, useEffect } from "react";
import useFetch from "../useFetch";
import classes from "./css/reviews.module.css";
import Rating from "./Rating";
import { IoAdd } from "react-icons/io5";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { useAppContext } from "../context/appContext";
import { Link } from "react-router-dom";

const Reviews = ({gameId, userReviewed, userRating, setUserRating}) => {
  const {user} = useAppContext();
  const [isReviewed, setIsReviewed] = useState(userReviewed); // TODO: change name
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewText, setReviewText] = useState(userReviewed || "");
  const [reviews,setReviews] = useState(null);
  const [reviewError, setReviewError] = useState("");

  const {data, isLoading, error} = useFetch({url:`/games/${gameId}/reviews`});

  useEffect(()=>{
    setReviews(data?.reviews);
  },[data])

  
  const handleChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleClick = () => {
    setIsReviewing(!isReviewing);
  };

  const submitReview = async () => {
    if (userRating && reviewText.trim()){
      try {      
        const {data:{review:userReview}} = await axios.patch(`/games/${gameId}/reviews`,{review_text:reviewText},{withCredentials:true});
        userReview.username = user.username;
    
        const tempReviews = reviews.filter(((review) => review.review_id != userReview.review_id));
    
        setReviews([userReview,...tempReviews]);
        setIsReviewed(reviewText);
        setIsReviewing(false);
        setReviewError("");
      } catch (error) {
        console.log(error);
      }
    }
    else if (!userRating){
      setReviewError("Rating required");
    }
    else if (!reviewText.trim()){
      setReviewError("Review can not be empty");
    }
  };

  const deleteReview = async () => {
    try {
      const {data:{review:userReview}} = await axios.delete(`/games/${gameId}/reviews`,{withCredentials:true});
      const tempReviews = reviews.filter(((review) => review.review_id != userReview.review_id));
  
      setReviews([...tempReviews]);
      setIsReviewed(null);
      setReviewText("");
      setUserRating(null);
      setIsReviewing(false);
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading) return <div>Loading...</div>;

  if (error) console.log(error);

  return (
    <div className={classes.container}>
      <header>
        <h2>Reviews</h2>
        { isReviewed ? (
          <>
            <button title="Edit your review" onClick={handleClick}>
              <MdEdit/>
            </button>
            <button title="Delete your review" onClick={deleteReview}>
              <MdDelete/>
            </button>
          </>
        )
        :
        (
          <button title="Add a review" onClick={handleClick}>
            <IoAdd 
              className={`${classes.add} ${isReviewing ? classes.rotated : ""}`} 
            />
          </button>
        )}
      </header>
      <div className={`${classes.inputContainer} ${isReviewing ? classes.active : ""}`}>
        <p>{reviewError}</p>
        <textarea
          className={classes.reviewInput}
          placeholder="What are your thoughts on this game?"
          value={reviewText}
          onChange={handleChange}
        />
        <button onClick={submitReview} className={classes.submit}>Submit</button>
      </div>
      <GameReviews reviews={reviews}/>
    </div>
  )
};


// seperating into another comp to reduce re rendering
const GameReviews = memo(({reviews}) => {
  return (
    reviews?.length > 0 ? (
      reviews.map((review)=>{
        return (
          <div key={review.review_id} className={classes.reviewContainer}>
            <header>
              <Link to={`/users/${review.username}`}>{review.username}</Link>
              <Rating avgRating={review.rating} size={"0.75em"}/>
            </header>
            <p>{review.review_text}</p>
          </div>
        );
      })
    )
    :
    (
      <div>No reviews yet</div>
    )
  );
})

export default memo(Reviews);