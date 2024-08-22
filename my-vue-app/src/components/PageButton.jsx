import { useSearchParams } from "react-router-dom";
import { IoChevronForwardSharp, IoChevronBackSharp } from "react-icons/io5";
import classes from "./css/pageButton.module.css";

const PageButton = ({lastPage}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const changePage = (pageNum) => {
    searchParams.set("page",pageNum);
    setSearchParams(searchParams);
  }

  return (
    <div className={classes.container}>
      <button onClick={()=>changePage(page-1)}> <IoChevronBackSharp/> Previous</button>
      <button onClick={()=>changePage(1)}>1</button>
      <button onClick={()=>changePage(lastPage)}>{lastPage}</button>
      <button onClick={()=>changePage(page+1)}>Next <IoChevronForwardSharp/></button>
    </div>
  )
}
export default PageButton