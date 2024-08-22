import { Link } from "react-router-dom";
import classes from "./css/usersContainer.module.css";
import ProfilePic from "./ProfilePic";

const UsersContainer = ({users}) => {

  return (
    <>
      {users.map((user) => {
        return (
          <div key={user.username} className={classes.container}>
            <Link to={`${user.username}/lists/played`}>
              <ProfilePic username={user.username} size="2.5rem" fontSize="1.15rem"/>
              <h3>
                {user.username}
              </h3>
            </Link>
            <small>Joined {(new Date(user.created_at)).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric' })}</small>
            <div className={classes.info}>
              <small>rated {user.rated}</small>
              <small>reviewed {user.reviewed}</small>
            </div>
          </div>
        )
      })}
    </>
  )
}
export default UsersContainer