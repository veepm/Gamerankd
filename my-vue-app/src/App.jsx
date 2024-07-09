import { BrowserRouter, Routes, Route } from "react-router-dom"
import {AllGames, Error, Landing, SharedLayout, SingleGame} from "./pages/index"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout/>}>  
          <Route index element={<Landing/>}/>     
          <Route path="games" element={<AllGames/>}/>
          <Route path="games/:gameId" element= {<SingleGame/>}/>
          <Route path="*" element={<Error/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
