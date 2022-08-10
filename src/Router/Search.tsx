import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vh;
  height: 200vh;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  return <Wrapper>{keyword}</Wrapper>;
}

export default Search;
