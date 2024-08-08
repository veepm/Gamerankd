import {GamesContainer, PageButton, Sort, SearchBar, GenresFilter} from "../components";
import { useAppContext } from "../context/appContext";
import useFetch from "../useFetch";
import classes from "./css/allGames.module.css";

const List = ({listName}) => {
  const {user} = useAppContext();

  const {data,isLoading,error} = useFetch({method:"get",url:`/users/${user.username}/${listName}`},[listName]);

  if (isLoading) return;

  return (
    data.list?.games ? (
      <div className={classes.container}>
        <div className={classes.header}>
          <SearchBar placeholder="Search For Games By Title"/>
          <div className={classes.filters}>
            <Sort/>
            <GenresFilter/>
          </div>
        </div>
        <GamesContainer gameCount={data.list.games.length} gameIds={data.list.games}/>
        <PageButton/>
       </div>
    )
    :
    (
     <div style={{margin:"10rem"}}>No Games In List</div>
    )
  )
}
export default List