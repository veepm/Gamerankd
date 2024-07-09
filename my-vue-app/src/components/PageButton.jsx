import {useAppContext} from "../context/appContext"

const PageButton = () => {
  const {page, changePage} = useAppContext();
  return (
    <button onClick={()=>changePage(page+1)}>Next Page</button>
  )
}
export default PageButton