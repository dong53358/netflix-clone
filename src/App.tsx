import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Router/Home";
import Tv from "./Router/Tv";
import Search from "./Router/Search";
import Header from "./Components/Header";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="movies/:Id" element={<Home />}></Route>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/tv/:Id" element={<Tv />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/search/:searchId" element={<Search />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
