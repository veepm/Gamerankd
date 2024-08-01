import { GamesContainer } from "../components"
import { useAppContext } from "../context/appContext"
import useFetch from "../useFetch"

const List = ({listName}) => {
  const {user} = useAppContext();

  const {data,isLoading,error} = useFetch({method:"get",url:`/users/${user.username}/${listName}`},[listName]);

  if (isLoading) return;

  return (
    data.list.games ? <GamesContainer gameIds={data.list.games}/> : <div style={{margin:"10rem"}}>No Games In List</div>
  )
}
export default List