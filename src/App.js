import React , { useEffect  } from "react";
import { BrowserRouter, Routes , Route } from "react-router-dom"
import Game from "../src/Components/Dashboard"
import Login from "./Components/Login"
import { useSelector } from "react-redux"

import "./App.css";

function App() {

   
  const test = useSelector(
    (state) => state.authState.userLoggedIn
    )



  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/game" element={<Game />}>
          </Route>
          <Route exact path="/" element={ test ?  <Game /> : <Login />}>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
