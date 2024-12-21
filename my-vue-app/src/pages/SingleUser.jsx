import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { GamesContainer, ProfilePic, SingleReview } from "../components";
import { IoChevronForwardSharp, IoLogIn } from "react-icons/io5";
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
      {gameQueries.map((gameQuery, i) => {
        const list = userListsQuery.data?.lists[i];
        return (
          <div key={list?.list_id} className={classes.list}>
            <Link
              className={classes.option}
              to={`lists/${list?.list_name}`}
            >
              {list?.list_name}
              <div>
                {list?.games?.length}
                <IoChevronForwardSharp />
              </div>
            </Link>
            <GamesContainer games={gameQuery?.data?.games} gameCount={5} isLoading={gameQuery.isLoading} resize={false}/>
          </div>
        );
      })}
      <div>
        <Link className={classes.option} to={"reviews"}>
          Reviews 
          <div>
            {userReviewsQuery.data?.review_count}
            <IoChevronForwardSharp />
          </div>
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
