import { useSearchParams } from "react-router-dom";
import useDebounce from "../useDebounce";
import { IoChevronForwardSharp, IoChevronBackSharp } from "react-icons/io5";
import classes from "./css/pageButton.module.css";

const PageButton = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const changePage = (pageNum) => {
    searchParams.set("page",pageNum);
    setSearchParams(searchParams);
  }

  const debounce = useDebounce(changePage);


  return (
    <div className={classes.container}>
      <button onClick={()=>changePage(page-1)}> <IoChevronBackSharp/> Previous</button>
      <button onClick={()=>changePage(page+1)}>Next <IoChevronForwardSharp/></button>
    </div>
  )
}
export default PageButton