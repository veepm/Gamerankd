import { useState } from "react";
import {GamesContainer, PageButton, Sort, SearchBar, GenresFilter} from "../components";
import classes from "./css/allGames.module.css";

const AllGames = () => {

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <SearchBar placeholder="Search For Games By Title"/>
        <div className={classes.filters}>
          <Sort/>
          <GenresFilter/>
        </div>
      </div>
      <GamesContainer/>
      <PageButton/>
    </div>
  )
};

export default AllGames;