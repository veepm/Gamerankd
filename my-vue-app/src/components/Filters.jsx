import Genres from "./Genres";
import classes from "./css/filters.module.css";

const Filters = () => {
  return (
    <form className={classes.filtersForm}>
      <h3>Filter By</h3>
      <Genres/>
      <label htmlFor="year">
        Year Made
      <input type="range" name="year" id="year" />
      </label>
    </form>
  )
}
export default Filters