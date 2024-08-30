import { useSearchParams } from "react-router-dom";
import { IoChevronForwardSharp, IoChevronBackSharp } from "react-icons/io5";
import classes from "./css/pageButton.module.css";
import { memo, useEffect, useState } from "react";

const PageButton = ({ totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [lastPageNum, setLastPageNum] = useState(totalPages);

  useEffect(() => {
    if (totalPages) {
      setLastPageNum(totalPages);
    }
  }, [totalPages]);

  const pages = Array.from({ length: lastPageNum }, (_, index) => {
    return index + 1;
  });

  const changePage = (pageNum) => {
    searchParams.set("page", pageNum);
    setSearchParams(searchParams);
  };

  return (
    <div className={classes.container}>
      <button onClick={() => changePage(page - 1)} className={`${classes.btn} ${page === 1 ? classes.disabled : ""}`}>
        <IoChevronBackSharp /> Previous
      </button>
      {pages.map((pageNum) => {
        if (
          (pageNum <= page + 1 && pageNum >= page - 1) ||
          pageNum === 1 ||
          pageNum === lastPageNum
        ) {
          return (
            <button
              onClick={() => changePage(pageNum)}
              className={
                page === pageNum
                  ? `${classes.active} ${classes.btn}`
                  : classes.btn
              }
              key={pageNum}
            >
              {pageNum}
            </button>
          );
        } else if (pageNum === 2 || pageNum === lastPageNum - 1) {
          return (
            <div className={classes.dots} key={pageNum}>
              &#x2026;
            </div>
          );
        }
      })}
      <button onClick={() => changePage(page + 1)} className={`${classes.btn} ${page === lastPageNum ? classes.disabled : ""}`}>
        Next <IoChevronForwardSharp />
      </button>
    </div>
  );
};
export default memo(PageButton);
