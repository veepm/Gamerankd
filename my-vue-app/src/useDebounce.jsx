import { useMemo } from "react";

const useDebounce = (state, setState) => {

  const debounce = () => {
    let timeoutID;
    return (e) => {
      setState(state);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        handleChange("search",e.target.value);
      }, 750);
    };
  };

  // remembers debounce func so that it isn't re-created on every re-render
  return useMemo(() => debounce(), []);

}
export default useDebounce