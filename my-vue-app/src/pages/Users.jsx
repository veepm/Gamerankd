import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PageButton, SearchBar, Sort, UsersContainer } from "../components";
import { useSearchParams } from "react-router-dom";
import classes from "./css/users.module.css";
import { useEffect } from "react";
import PuffLoader from "react-spinners/PuffLoader";

const options = [
  {
    group: "Games Played",
    options: [
      { label: "Highest", value: "highest" },
      { label: "Lowest", value: "lowest" },
    ],
  },
  {
    group: "Average Rating",
    options: [
      { label: "Highest Rated", value: "highestRated" },
      { label: "Lowest Rated", value: "lowestRated" },
    ],
  },
  {
    group: "Year Made",
    options: [
      { label: "Latest", value: "latest" },
      { label: "Oldest", value: "oldest" },
    ],
  },
];

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 9;

  useEffect(() => {
    document.title = "Users - Gamerankd";
  }, []);

  const usersQuery = useQuery({
    queryKey: ["users", { search }, { page }],
    queryFn: async () => {
      const { data } = await axios.get(
        `users?search=${search}&page=${page}&limit=${limit}`
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });

  if (usersQuery.isError) console.log(usersQuery.error);

  return (
    <div className={classes.container}>
      <header>
        <SearchBar placeholder="Search For Users By Username" />
      </header>
      <div className={classes.users}>
        {usersQuery.isLoading ? (
          <PuffLoader color="var(--primary-400)" />
        ) : (
          usersQuery.isSuccess && (
            <UsersContainer users={usersQuery.data.users} />
          )
        )}
        <div className={classes.pages}>
          <PageButton totalPages={usersQuery?.data?.total_pages} />
        </div>
      </div>
    </div>
  );
};
export default Users;
