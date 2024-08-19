import { useState, memo, useRef, useEffect } from "react";
import classes from "./css/reviews.module.css";
import Rating from "./Rating";
import { IoAdd } from "react-icons/io5";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { useAppContext } from "../context/appContext";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

const Reviews = ({gameId, userReviewed, userRating, setUserRating}) => {
  const {user} = useAppContext();
  const [isReviewed, setIsReviewed] = useState(userReviewed); // TODO: change name
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewText, setReviewText] = useState(userReviewed || "");
  const [reviews,setReviews] = useState(null);
  const [reviewError, setReviewError] = useState("");

  const reviewsQuery = useQuery({
    queryKey: ["games", gameId, "reviews"],
    queryFn: async () => {
      const {data} = await axios.get(`/games/${gameId}/reviews`);
      setReviews(data.reviews);
      return data;
    }
  });

  const submitReviewMutation = useMutation({
    mutationFn: () => axios.patch(`/games/${gameId}/reviews`,{review_text:reviewText},{withCredentials:true}),
    onSuccess: (data) => {
      data.data.review.username = user.username;
    
      const tempReviews = reviews.filter(((review) => review.review_id != data.data.review.review_id));
  
      setReviews([data.data.review,...tempReviews]);
      setIsReviewed(reviewText);
      setIsReviewing(false);
      setReviewError("");
    }
  });

  const deleteReviewMutation = useMutation({
    mutationFn: () => axios.delete(`/games/${gameId}/reviews`,{withCredentials:true}),
    onSuccess: (data) => {
      const tempReviews = reviews.filter(((review) => review.review_id != data.data.review.review_id));
  
      setReviews([...tempReviews]);
      setIsReviewed(null);
      setReviewText("");
      setUserRating(null);
      setIsReviewing(false);
    }
  })
  
  const handleChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleClick = () => {
    setIsReviewing(!isReviewing);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (userRating && reviewText.trim()){
      submitReviewMutation.mutate();
    }
    else if (!userRating){
      setReviewError("Rating required");
    }
    else if (!reviewText.trim()){
      setReviewError("Review can not be empty");
    }
  };

  if (reviewsQuery.isLoading) return <div>Loading...</div>;

  if (reviewsQuery.isError) console.log(error);

  return (
    <div className={classes.container}>
      <header>
        <h2>Reviews</h2>
        <div className={classes.reviewActions}>
          { isReviewed ? (
            <>
              <button title="Edit your review" onClick={handleClick}>
                <MdEdit/>
              </button>
              <button title="Delete your review" onClick={deleteReviewMutation.mutate}>
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
        </div>
      </header>
      <p>{reviewError}</p>
      <form className={`${classes.inputContainer} ${isReviewing ? classes.active : ""}`} onSubmit={submitReview}>
        <textarea
          className={classes.reviewInput}
          placeholder="What are your thoughts on this game?"
          value={reviewText}
          onChange={handleChange}
        />
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
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