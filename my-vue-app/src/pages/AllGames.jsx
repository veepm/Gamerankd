import {Filters, GamesContainer, PageButton, Sort, SearchBar} from "../components"

const AllGames = () => {

  return (
    <div style={{marginTop:"5rem",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <Filters/>
      <div>
        <SearchBar placeholder="Search For Games By Title"/>
        <Sort/>
      </div>
      <GamesContainer/>
      <PageButton/>
    </div>
  )
}
export default AllGames