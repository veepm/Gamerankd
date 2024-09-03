import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PageButton, SearchBar, Sort, UsersContainer } from "../components";
import { useSearchParams } from "react-router-dom";
import classes from "./css/users.module.css";

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
        <Sort options={options} />
      </header>
      <div className={classes.users}>
        {usersQuery.isSuccess && (
          <UsersContainer users={usersQuery.data.users} />
        )}
      </div>
      <PageButton totalPages={usersQuery?.data?.total_pages} />
    </div>
  );
};
export default Users;
