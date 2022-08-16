import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ISearch, search } from "../api";
import SearchDetail from "../Components/search/SearchDetail";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 0px;
  width: 100vh;
  height: 200vh;
`;

const Loader = styled.div`
  text-align: center;
  width: 100%;
  height: 500px;
  font-size: 100px;
`;

const WhatSearch = styled.div`
  width: 100%;
  margin: 50px;
  font-size: 30px;
  font-weight: 600;
  position: absolute;
`;

const SearchSlider = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
  padding: 110px 40px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  height: 200px;
  color: white;
  font-size: 20px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  position: relative;
  &:hover {
    z-index: 50;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  div:first-child {
    color: white;
    text-shadow: 2px 2px 2px gray;
    text-align: center;
  }
`;

const Info = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-size: cover;

  div:first-child {
    margin-right: 6px;
    font-size: 18px;
    color: red;
  }
  div:last-child {
    font-size: 20px;
    color: red;
    margin-bottom: 3px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 48vw;
  height: 100vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 20px;
  z-index: 9999;
  //overflow: hidden;
`;

const boxVarints = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      typetrailer: "tween",
    },
  },
};

function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const searchMatch = useMatch("/search/:searchId");
  const [clickKeyword, setClickKeyword] = useState("");
  const { data, isLoading } = useQuery<ISearch>(["search"], () =>
    search(keyword)
  );
  const onBoxClicked = (searchId: number) => {
    navigate(`/search/${searchId}`);
    setClickKeyword(keyword);
  };
  const onOverlayClick = () => {
    navigate(`/search?keyword=${clickKeyword}`);
  };
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <WhatSearch>검색결과</WhatSearch>
          <AnimatePresence>
            <SearchSlider>
              {data.results.map((search) => (
                <Box
                  layoutId={search.id + ""}
                  onClick={() => onBoxClicked(search.id)}
                  key={search.id}
                  variants={boxVarints}
                  whileHover="hover"
                  initial="normal"
                  transition={{
                    type: "tween",
                  }}
                  bgphoto={
                    search.backdrop_path
                      ? makeImagePath(search.backdrop_path, "w400")
                      : search.poster_path
                      ? makeImagePath(search.poster_path, "w400")
                      : "/assets/netflix.png"
                  }
                >
                  <div>
                    {search.name}
                    {search.title}
                  </div>
                  <Info variants={infoVariants}>
                    <div>
                      <FaStar />
                    </div>
                    <div>{search.vote_average}</div>
                  </Info>
                </Box>
              ))}
            </SearchSlider>
          </AnimatePresence>
          <AnimatePresence>
            {searchMatch && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigBox
                  layoutId={searchMatch?.params.searchId}
                  style={{
                    top: scrollY.get() + 50,
                  }}
                >
                  {searchMatch ? (
                    <SearchDetail id={searchMatch.params.searchId} />
                  ) : //<div>hello</div>
                  null}
                </BigBox>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
