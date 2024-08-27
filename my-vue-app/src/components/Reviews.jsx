import { useState, memo, useEffect } from "react";
import classes from "./css/reviews.module.css";
import { IoAdd } from "react-icons/io5";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { useAppContext } from "../context/appContext";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import useUserInfo from "../useUserInfo";
import PuffLoader from "react-spinners/PuffLoader";
import SingleReview from "./SingleReview";
import Select from "./Select";

const Reviews = ({ gameId }) => {
  const { user } = useAppContext();
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [sortBy, setSortBy] = useState({ label: "Latest", value: "latest" });

  const queryClient = useQueryClient();

  const reviewsQuery = useInfiniteQuery({
    queryKey: ["games", gameId, "reviews", {sortBy:sortBy.value}],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) =>
      lastPage.last_page > lastPageParam ? lastPageParam + 1 : null,
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get(
        `/games/${gameId}/reviews?limit=4&page=${pageParam}&sortBy=${sortBy.value}`
      );
      return data;
    },
  });

  const userInfoQuery = useUserInfo(gameId);

  useEffect(() => {
    setReviewText(userInfoQuery?.data?.review_text || "");
  }, [userInfoQuery?.data?.review_text]);

  const submitReviewMutation = useMutation({
    mutationFn: () =>
      axios.patch(
        `/games/${gameId}/reviews`,
        { review_text: reviewText },
        { withCredentials: true }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games", gameId, "reviews"] });
      queryClient.invalidateQueries({
        queryKey: ["users", user?.username, "games", gameId],
      });
      setIsReviewing(false);
      setReviewError("");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: () =>
      axios.patch(
        `/games/${gameId}/reviews`,
        { review_text: null },
        { withCredentials: true }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games", gameId, "reviews"] });
      queryClient.invalidateQueries({
        queryKey: ["users", user?.username, "games", gameId],
      });
      setIsReviewing(false);
    },
  });

  const handleChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleClick = () => {
    setIsReviewing(!isReviewing);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (userInfoQuery?.data?.rating && reviewText.trim()) {
      submitReviewMutation.mutate();
    } else if (!userInfoQuery?.data?.rating) {
      setReviewError("Rating required");
    } else if (!reviewText.trim()) {
      setReviewError("Review can not be empty");
    }
  };

  if (reviewsQuery.isError) console.log(reviewsQuery.error);

  if (deleteReviewMutation.isError) console.log(deleteReviewMutation.error);

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <h2>{reviewsQuery?.data?.pages[0].review_count} Reviews</h2>
        <div className={classes.reviewActions}>
          {userInfoQuery?.data?.review_text ? (
            <>
              <button title="Edit your review" onClick={handleClick}>
                <MdEdit />
              </button>
              <button
                title="Delete your review"
                onClick={deleteReviewMutation.mutate}
              >
                <MdDelete />
              </button>
            </>
          ) : (
            <button title="Add a review" onClick={handleClick}>
              <IoAdd
                className={`${classes.add} ${
                  isReviewing ? classes.rotated : ""
                }`}
              />
            </button>
          )}
        </div>
        <Select
          options={[
            {
              options: [
                { label: "Latest", value: "latest" },
                { label: "Oldest", value: "oldest" },
              ],
            },
          ]}
          value={sortBy}
          onChange={setSortBy}
        />
      </header>
      <p>{reviewError}</p>
      <form
        className={`${classes.inputContainer} ${
          isReviewing ? classes.active : ""
        }`}
        onSubmit={submitReview}
      >
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
      {reviewsQuery.isLoading ? (
        <div className={classes.loader}>
          <PuffLoader color="white" />
        </div>
      ) : (
        <GameReviews pages={reviewsQuery?.data?.pages} />
      )}
      <div className={classes.loader}>
        <PuffLoader loading={reviewsQuery.isFetchingNextPage} color="white" />
      </div>
      {reviewsQuery.hasNextPage && (
        <button
          onClick={
            !reviewsQuery.isFetchingNextPage
              ? reviewsQuery.fetchNextPage
              : undefined
          }
        >
          Next
        </button>
      )}
    </div>
  );
};

// seperating into another comp to reduce re rendering
const GameReviews = memo(({ pages }) => {
  return pages[0].review_count > 0 ? (
    pages.map((page) => {
      return page.reviews.map((review) => (
        <SingleReview review={review} key={review.review_id} />
      ));
    })
  ) : (
    <div>No reviews yet</div>
  );
});

export default memo(Reviews);
