import { useParams } from "react-router-dom";
import {GamesContainer, PageButton, Sort, SearchBar, GenresFilter} from "../components";
import { useAppContext } from "../context/appContext";
import useFetch from "../useFetch";
import classes from "./css/allGames.module.css";

const List = () => {
  const {user} = useAppContext();
  const {username, listName} = useParams();

  const {data,isLoading,error} = useFetch({method:"get",url:`/users/${username}/lists/${listName}`},[listName]);

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