import { Link } from "react-router-dom";
import classes from "./css/usersContainer.module.css";
import ProfilePic from "./ProfilePic";

const UsersContainer = ({users}) => {

  return (
    <div className={classes.container}>
      {users.map((user) => {
        return (
          <div key={user.username}>
            <div className={classes.user}>
              <Link to={`${user.username}`}>
                <ProfilePic username={user.username} size="2.5rem" fontSize="1.15rem"/>
                <h3>
                  {user.username}
                </h3>
              </Link>
              <small>Joined {(new Date(user.created_at)).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric' })}</small>
            </div>
            <div className={classes.info}>
              <small>rated {user.rated}</small>
              <small>reviewed {user.reviewed}</small>
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default UsersContainer