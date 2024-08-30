import controller from "../assets/controller.png";
import classes from "./css/landing.module.css";

const Landing = () => {
  return (
    <div className={classes.container}>
        {/* <img src={controller} style={{ filter: "drop-shadow(10px 10px)" }} /> */}
        <h1 className={classes.title}>GameRankD</h1>
    </div>
  );
};

export default Landing;
