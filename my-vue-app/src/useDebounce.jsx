import { useMemo } from "react";

const useDebounce = (onCompletion, onChange, deps=[]) => {

  const debounce = () => {
    let timeoutID;
    return (...args) => {

      if (onChange) onChange(...args);
      clearTimeout(timeoutID);

      timeoutID = setTimeout(() => {
        onCompletion(...args);
      }, 750);
    };
  };

  // remembers debounce func so that it isn't re-created on every re-render
  return useMemo(() => debounce(), deps);

}
export default useDebounce