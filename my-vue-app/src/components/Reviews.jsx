import { useState, memo, useEffect } from "react";
import classes from "./css/reviews.module.css";
import Rating from "./Rating";
import { IoAdd } from "react-icons/io5";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { useAppContext } from "../context/appContext";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUserInfo from "../useUserInfo";

const Reviews = ({gameId}) => {
  const {user} = useAppContext();
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviews,setReviews] = useState(null);
  const [reviewError, setReviewError] = useState("");

  const queryClient = useQueryClient();

  
  const reviewsQuery = useQuery({
    queryKey: ["games", gameId, "reviews"],
    queryFn: async () => {
      const {data} = await axios.get(`/games/${gameId}/reviews`);
      setReviews(data.reviews);
      return data;
    }
  });
  
  const userInfoQuery = useUserInfo(gameId);

  useEffect(() => {
    setReviewText(userInfoQuery?.data?.review_text || "");
  },[userInfoQuery?.data?.review_text])
  
  const submitReviewMutation = useMutation({
    mutationFn: () => axios.patch(`/games/${gameId}/reviews`,{review_text:reviewText},{withCredentials:true}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["games",gameId,"reviews"]});
      queryClient.invalidateQueries({queryKey: ["users", user?.username, "games", gameId]});
      setIsReviewing(false);
      setReviewError("");
    }
  });

  const deleteReviewMutation = useMutation({
    mutationFn: () => axios.patch(`/games/${gameId}/reviews`,{review_text:null},{withCredentials:true}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["games", gameId, "reviews"]});
      queryClient.invalidateQueries({queryKey: ["users", user?.username, "games", gameId]});
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
    if (userInfoQuery?.data?.rating && reviewText.trim()){
      submitReviewMutation.mutate();
    }
    else if (!userInfoQuery?.data?.rating){
      setReviewError("Rating required");
    }
    else if (!reviewText.trim()){
      setReviewError("Review can not be empty");
    }
  };

  if (reviewsQuery.isLoading) return <div>Loading...</div>;

  if (reviewsQuery.isError) console.log(reviewsQuery.error);

  if (deleteReviewMutation.isError) console.log(deleteReviewMutation.error);

  return (
    <div className={classes.container}>
      <header>
        <h2>Reviews</h2>
        <div className={classes.reviewActions}>
          { userInfoQuery?.data?.review_text ? (
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