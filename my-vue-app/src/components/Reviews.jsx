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
import { toast } from "react-toastify";

const Reviews = ({ gameId, username }) => {
  const { user } = useAppContext();
  const [isReviewing, setIsReviewing] = useState(false);
  const [sortBy, setSortBy] = useState({ label: "Latest", value: "latest" });

  const queryClient = useQueryClient();

  const reviewsQuery = useInfiniteQuery({
    queryKey: [
      (gameId && "games") || (username && "users"),
      gameId || username,
      "reviews",
      { sortBy: sortBy.value },
    ],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) =>
      lastPage.total_pages > lastPageParam ? lastPageParam + 1 : null,
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get(
        `/${(gameId && "games") || (username && "users")}/${
          gameId || username
        }/reviews?limit=4&page=${pageParam}&sortBy=${sortBy.value}`
      );
      return data;
    },
  });

  const userInfoQuery = useUserInfo(gameId);

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

  const handleClick = () => {
    setIsReviewing(!isReviewing);
  };

  if (reviewsQuery.isError) console.log(reviewsQuery.error);

  if (deleteReviewMutation.isError) console.log(deleteReviewMutation.error);

  return (
    <div className={classes.container} style={{ margin: username && "3rem" }}>
      <header className={classes.header}>
        <h2>{reviewsQuery?.data?.pages[0].review_count} Reviews</h2>
        {gameId && (
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
        )}
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
          className={classes.sortBy}
          openOnHover
        />
      </header>
      {gameId && (
        <ReviewInput
          gameId={gameId}
          rated={userInfoQuery?.data?.rating}
          defaultText={userInfoQuery?.data?.review_text}
          isReviewing={isReviewing}
          setIsReviewing={setIsReviewing}
        />
      )}
      {reviewsQuery.isLoading ? (
        <div className={classes.loader}>
          <PuffLoader color="white" />
        </div>
      ) : (
        <GameReviews pages={reviewsQuery?.data?.pages} showGame={username} />
      )}
      <div className={classes.loader}>
        <PuffLoader loading={reviewsQuery.isFetchingNextPage} color="white" />
      </div>
      {!reviewsQuery.isFetchingNextPage && reviewsQuery.hasNextPage && (
        <button
          onClick={
            !reviewsQuery.isFetchingNextPage
              ? reviewsQuery.fetchNextPage
              : undefined
          }
        >
          More
        </button>
      )}
    </div>
  );
};

// seperating into another comp to reduce re rendering
const GameReviews = memo(({ pages, showGame }) => {
  return pages[0].review_count > 0 ? (
    <div className={classes.reviews}>
      {pages.map((page) => {
        return page.reviews.map((review) => (
          <SingleReview
            review={review}
            key={review.review_id}
            showGame={showGame}
          />
        ));
      })}
    </div>
  ) : (
    <div className={classes.reviews}>No reviews yet</div>
  );
});

const ReviewInput = memo(
  ({ gameId, rated, defaultText, isReviewing, setIsReviewing }) => {
    const [reviewText, setReviewText] = useState(defaultText);
    const queryClient = useQueryClient();
    const { user } = useAppContext();

    useEffect(() => {
      setReviewText(defaultText || "");
    }, [defaultText]);

    const handleChange = (e) => {
      setReviewText(e.target.value);
    };

    const submitReview = async (e) => {
      e.preventDefault();
      if (rated && reviewText.trim()) {
        submitReviewMutation.mutate();
      } else if (!rated) {
        toast.error("Rating required");
      } else if (!reviewText.trim()) {
        toast.error("Review can not be empty");
      }
    };

    const submitReviewMutation = useMutation({
      mutationFn: () =>
        axios.patch(
          `/games/${gameId}/reviews`,
          { review_text: reviewText },
          { withCredentials: true }
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["games", gameId, "reviews"],
        });
        queryClient.invalidateQueries({
          queryKey: ["users", user?.username, "games", gameId],
        });
        setIsReviewing(false);
        toast.success("Submitted Review");
      },
      onError: (error) => console.log(error),
    });

    return (
      <form
        className={`${classes.inputContainer} ${
          isReviewing ? classes.active : ""
        }`}
        onSubmit={submitReview}
      >
        <textarea
          className={classes.reviewInput}
          placeholder={
            user
              ? "What are your thoughts on this game?"
              : "Login to add review"
          }
          value={reviewText}
          onChange={handleChange}
          readOnly={!user}
        />
        <div>
          <button
            type="submit"
            disabled={!user}
            style={{ cursor: !user && "default" }}
          >
            Submit
          </button>
        </div>
      </form>
    );
  }
);

export default memo(Reviews);
