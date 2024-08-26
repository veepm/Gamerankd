import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { PageButton, SearchBar, UsersContainer } from "../components";
import { useSearchParams } from "react-router-dom";
import classes from "./css/users.module.css";

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const usersQuery = useQuery({
    queryKey: ["users",{search},{page}],
    queryFn: async () => {
      const {data} = await axios.get(`users?search=${search}&page=${page}&limit=${limit}`);
      return data;
    }
  });

  if (usersQuery.isError) console.log(usersQuery.error);

  return (
    <div className={classes.container}>
      <SearchBar placeholder="Search For Users By Username"/>
      <div className={classes.users}>
        {usersQuery.isSuccess && <UsersContainer users={usersQuery.data.users}/>}
      </div>
      <PageButton lastPage={usersQuery.data?.last_page}/>
    </div>
  )
}
export default Users