import { useState, memo } from "react";
import classes from "./css/gameDetails.module.css";


const GameDetails = (props) => {
  const [selectedTab, setSelectedTab] = useState("developers");

  return (
    <div className={classes.container}>
      <header>
        <button onClick={()=>setSelectedTab("developers")}>
          Developers
        </button>
        <button onClick={()=>setSelectedTab("publishers")}>
          Publishers
        </button>
        <button onClick={()=>setSelectedTab("platforms")}>
          Platforms
        </button>
      </header>
      <div>
        {props[selectedTab]?.map((info => {
          return <div key={info.id}>{info.name}</div>;
        }))}
      </div>
    </div>
  )
};

export default memo(GameDetails);