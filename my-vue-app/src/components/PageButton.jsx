import { useSearchParams } from "react-router-dom";
import { IoChevronForwardSharp, IoChevronBackSharp } from "react-icons/io5";
import classes from "./css/pageButton.module.css";
import { memo, useEffect, useState } from "react";

const PageButton = ({ totalPages, siblingCount = 1 }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const pages = Array.from({ length: totalPages }, (_, index) => {
    return index + 1;
  });

  const changePage = (pageNum) => {
    searchParams.set("page", pageNum);
    setSearchParams(searchParams);
  };

  return (
    <div className={classes.container}>
      <button
        onClick={() => changePage(page - 1)}
        className={`${classes.btn} ${page === 1 ? classes.disabled : ""} ${
          classes.prev
        }`}
      >
        <IoChevronBackSharp /> Previous
      </button>
      {pages.map((pageNum) => {
        const middle = (4 + 2 * siblingCount + 1) / 2;
        if (
          (page < 1 + middle && pageNum < 1 + (middle + siblingCount)) ||
          (page > totalPages - middle &&
            pageNum > totalPages - (siblingCount + middle)) ||
          (pageNum <= page + siblingCount && pageNum >= page - siblingCount) ||
          pageNum === 1 ||
          pageNum === totalPages
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
              {/* {Intl.NumberFormat('en-US', {notation:"compact"}).format(pageNum)} */}
              {pageNum}
            </button>
          );
        } else if (pageNum === 2 || pageNum === totalPages - 1) {
          return (
            <div className={classes.dots} key={pageNum}>
              &#x2026;
            </div>
          );
        }
      })}
      <button
        onClick={() => changePage(page + 1)}
        className={`${classes.btn} ${
          page === totalPages ? classes.disabled : ""
        } ${classes.next}`}
      >
        Next <IoChevronForwardSharp />
      </button>
    </div>
  );
};
export default memo(PageButton);
