import Reviews from "../components/Reviews";
import { useParams } from "react-router-dom";
import classes from "./css/userReviews.module.css";

const UserReviews = () => {
  const { username } = useParams();
  return (
    <div className={classes.container}>
      <Reviews username={username} />
    </div>
  );
};
export default UserReviews;
