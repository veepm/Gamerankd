import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { IoChevronForwardSharp } from "react-icons/io5";
import classes from "./css/singleUser.module.css";
import { useEffect } from "react";
import ProfilePic from "../components/ProfilePic";
import SingleReview from "../components/SingleReview";
import StackedGames from "../components/StackedGames";

const SingleUser = () => {
  const { username } = useParams();

  useEffect(() => {
    document.title = `${username + "'s Profile"} - Gameranked`;
  }, []);

  const userListsQuery = useQuery({
    queryKey: ["users", username, "lists"],
    queryFn: async () => {
      const { data } = await axios.get(`users/${username}/lists`);
      return data;
    },
  });

  const gameQueries = useQueries({
    queries: (userListsQuery.data?.lists ?? []).map((list) => {
      let url = `/games?coverSize=cover_big_2x&limit=5&fields=cover.url,name`;
      list.games.forEach((game) => {
        url += `&id[]=${game}`;
      });
      return {
        queryKey: ["games", { ids: list.games }],
        queryFn: async () => {
          const { data } = await axios.get(url);
          return data;
        },
        enabled: list.games.length > 0,
      };
    }),
  });

  const userReviewsQuery = useQuery({
    queryKey: [
      "users",
      username,
      "reviews",
      { limit: 3 },
      { sortBy: "latest" },
    ],
    queryFn: async () => {
      const { data } = await axios.get(
        `users/${username}/reviews?limit=3&sortBy=latest`
      );
      return data;
    },
  });

  return (
    <div className={classes.container}>
      <div className={classes.user}>
        <ProfilePic username={username} />
        <h2>{username}</h2>
      </div>
      <section>
        {gameQueries.map((gameQuery, i) => {
          const list = userListsQuery.data?.lists[i];
          if (list?.games?.length > 0) {
            return (
              <Link
                key={list?.list_id}
                className={`${classes.option} ${classes.list}`}
                to={`lists/${list?.list_name}`}
              >
                <span className={classes.optionName}>{list?.list_name}</span>
                <span className={classes.count}>
                  {list?.games?.length}
                  <IoChevronForwardSharp />
                </span>
                <StackedGames games={gameQuery?.data?.games} />
              </Link>
            );
          }
        })}
      </section>
      <section>
        <Link
          className={classes.option}
          to={"reviews"}
          style={{
            pointerEvents: userReviewsQuery.data?.review_count == 0 && "none",
            cursor: userReviewsQuery.data?.review_count == 0 && "default",
          }}
        >
          <span className={classes.optionName}>Reviews/Ratings</span>
          <span className={classes.count}>
            {userReviewsQuery.data?.review_count}
            <IoChevronForwardSharp />
          </span>
        </Link>
        <div className={classes.reviews}>
          {userReviewsQuery.data?.reviews?.map((review) => {
            return (
              <SingleReview review={review} showGame key={review.review_id} />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SingleUser;
