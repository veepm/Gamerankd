import { useState } from "react"
import {Filters, GamesContainer, Sort} from "../components/index"

const AllGames = () => {

  return (
    <>
      <Sort/>
      <Filters/>
      <GamesContainer/>
    </>
  )
}
export default AllGames