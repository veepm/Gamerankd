import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { PageButton, SearchBar, UsersContainer } from "../components";
import { useSearchParams } from "react-router-dom";

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 15;

  const usersQuery = useQuery({
    queryKey: ["users",{search},{page}],
    queryFn: async () => {
      const {data} = await axios.get(`users?search=${search}&page=${page}&limit=${limit}`);
      return data;
    }
  });

  if (usersQuery.isError) console.log(usersQuery.error);

  return (
    <div style={{marginTop:"5rem"}}>
      <SearchBar placeholder="Search For Users By Username"/>
      {usersQuery.isSuccess && <UsersContainer users={usersQuery.data.users}/>}
      <PageButton lastPage={usersQuery.data?.last_page}/>
    </div>
  )
}
export default Users