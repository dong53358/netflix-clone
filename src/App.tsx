import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Router/Home";
import Tv from "./Router/Tv";
import Search from "./Router/Search";
import Header from "./Components/Header";
function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="movies/:Id" element={<Home />}></Route>
        </Route>
        <Route path="/tv" element={<Tv />}>
          <Route path="/tv/:Id" element={<Tv />}></Route>
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path="/search/*" element={<Search />}></Route>
          <Route path="/search/:searchId" element={<Search />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
