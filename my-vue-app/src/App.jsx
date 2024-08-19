import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Games, Error, Landing, SharedLayout, SingleGame, Login, Register, ProtectedRoute} from "./pages/index";
import "./axios";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout/>}>  
          <Route index element={<Landing/>}/>     
          <Route path="games" element={<Games/>}/>
          <Route path="games/:gameId" element={<SingleGame/>}/>
          <Route path="/users/:username/lists/:listName" element={<Games/>}/>
          <Route path="*" element={<Error/>}/>
        </Route>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
};

export default App;
