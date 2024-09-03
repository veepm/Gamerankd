import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { GamesContainer, ProfilePic, SingleReview } from "../components";
import { IoChevronForwardSharp } from "react-icons/io5";
import classes from "./css/singleUser.module.css";

const SingleUser = () => {
  const { username } = useParams();

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
        `users/${username}/reviews?limit=10&sortBy=latest`
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
      {gameQueries.map((game, i) => {
        return (
          <div key={userListsQuery.data?.lists[i]?.list_id} className={classes.list}>
            <Link
              className={classes.option}
              to={`lists/${userListsQuery.data?.lists[i]?.list_name}`}
            >
              {userListsQuery.data?.lists[i]?.list_name}{" "}
              <IoChevronForwardSharp />
            </Link>
            <GamesContainer gamesQuery={game} />
          </div>
        );
      })}
      <div>
        <Link className={classes.option} to={"reviews"}>
          Reviews <IoChevronForwardSharp />
        </Link>
        <div className={classes.reviews}>
          {userReviewsQuery.data?.reviews?.map((review) => {
            return (
              <SingleReview review={review} showGame key={review.review_id} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
