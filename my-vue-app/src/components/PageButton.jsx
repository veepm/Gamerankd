import { useSearchParams } from "react-router-dom";

const PageButton = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const changePage = (pageNum) => {
    searchParams.set("page",pageNum);
    setSearchParams(searchParams,{replace:true});
  }

  return (
    <div>
      <button onClick={()=>changePage(page-1)}>Previous Page</button>
      <button onClick={()=>changePage(page+1)}>Next Page</button>
    </div>
  )
}
export default PageButton