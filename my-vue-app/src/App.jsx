import { BrowserRouter, Routes, Route } from "react-router-dom"
import {AllGames, Error, Landing, SharedLayout, SingleGame, Login, Register, List, ProtectedRoute} from "./pages/index"
import "./axios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout/>}>  
          <Route index element={<Landing/>}/>     
          <Route path="games" element={<AllGames/>}/>
          <Route path="games/:gameId" element={<SingleGame/>}/>
          <Route path="wishlist" element={<ProtectedRoute> <List listName={"wishlist"}/> </ProtectedRoute>}/>
          <Route path="played" element={<ProtectedRoute> <List listName={"played"}/> </ProtectedRoute>}/>
          <Route path="*" element={<Error/>}/>
        </Route>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
