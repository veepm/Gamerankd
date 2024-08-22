import { useState, memo, useEffect } from "react";
import classes from "./css/reviews.module.css";
import Rating from "./Rating";
import { IoAdd } from "react-icons/io5";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { useAppContext } from "../context/appContext";
import { Link } from "react-router-dom";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import useUserInfo from "../useUserInfo";
import PuffLoader from "react-spinners/PuffLoader";
import ProfilePic from "./ProfilePic";

const Reviews = ({gameId}) => {
  const {user} = useAppContext();
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");

  const queryClient = useQueryClient();

  const reviewsQuery = useInfiniteQuery({
    queryKey: ["games", gameId, "reviews"],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => lastPage.last_page > lastPageParam ? lastPageParam + 1 : null,
    queryFn: async ({pageParam}) => {
      const {data} = await axios.get(`/games/${gameId}/reviews?limit=4&page=${pageParam}`);
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
      {reviewsQuery.isLoading ?
        <div className={classes.loader}><PuffLoader color="white"/></div>
        :
        <GameReviews pages={reviewsQuery?.data?.pages}/>
      }
      <div className={classes.loader}><PuffLoader loading={reviewsQuery.isFetchingNextPage} color="white"/></div>
      {reviewsQuery.hasNextPage && <button onClick={!reviewsQuery.isFetchingNextPage && reviewsQuery.fetchNextPage}>Next</button>}
    </div>
  )
};


// seperating into another comp to reduce re rendering
const GameReviews = memo(({pages}) => {
  return (
    pages[0].review_count > 0 ? (
      pages.map((page)=>{
        return (
          page.reviews.map((review)=>{
            return (
              <div key={review.review_id} className={classes.reviewContainer}>
                <header>
                  <div>
                    <Link to={`/users/${review.username}`}>
                      <ProfilePic username={review.username} size="2rem" fontSize="1rem"/>
                      {review.username}
                    </Link>
                    <Rating avgRating={review.rating} size={"0.75em"}/>
                  </div>
                  <div>
                    <small>{(new Date(review.created_at)).toLocaleDateString("en-UK")}</small>
                  </div>
                </header>
                <p>{review.review_text}</p>
              </div>
            )
          })
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