import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieVedio,
  getNowPlayMovies,
  getTopRateMovies,
  IGetMoviesResult,
  IGetTopMovies,
  IGetVideosResult,
} from "../api";
import { makeImagePath, makeImagePath2, makeTrailerPath } from "../utils";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Wrapper = styled.div`
  background-color: black;
  height: 200vh;
  width: 100vw;
`;

const Trailer = styled.div`
  width: 100vw;
  height: 100vh;
  margin-bottom: 10px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 50px;
  font-weight: 600;
`;

const Video = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Banner = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
  padding-bottom: 110px;
  padding-left: 60px;
  text-shadow: 4px 4px 4px gray;
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  font-size: 25px;
  font-weight: 600;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  height: 200px;
  top: -100px;
  margin-bottom: 100px;
`;

const SliderName = styled.div`
  font-size: 35px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-left: 20px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  margin-bottom: 10px;
  position: absolute;
  width: 100%;
`;

const NextPage = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  height: 100%;
  width: 50px;
  position: absolute;
  right: 0;
  z-index: 10;
  color: white;
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-size: cover;
  h4 {
    text-align: center;
    font-size: 18px;
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

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 30vw;
  height: 70vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 20px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  height: 350px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 36px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 20px;
  position: relative;
  top: -80px;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth - 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 10,
  },
};

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
      type: "tween",
    },
  },
};

const offset = 6;

function Home() {
  localStorage.setItem("movieId", "616037");
  const stateMovieId = localStorage.getItem("movieId");
  const { data: trailer, isLoading: movieLoding } = useQuery<IGetVideosResult>(
    ["videos"],
    () => getMovieVedio(String(stateMovieId))
  );
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const bigMovieMatch2 = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetTopMovies>(
    ["movies", "nowPlaying"],
    getNowPlayMovies
  );
  const { data: topMovieData, isLoading: topMovieDataLoding } =
    useQuery<IGetTopMovies>(["topMovies", "topMovie"], getTopRateMovies);
  const [index, setIndex] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [leaving2, setLeaving2] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const toggleLeaving2 = () => {
    setLeaving2((prev) => !prev);
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMocies = data.results.length - 1;
      const maxIndex = Math.floor(totalMocies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndex2 = () => {
    if (topMovieData) {
      if (leaving2) return;
      toggleLeaving2();
      const totalMocies2 = topMovieData.results.length - 1;
      const maxIndex2 = Math.floor(totalMocies2 / offset) - 1;
      setIndex2((prev) => (prev === maxIndex2 ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onBoxClicked2 = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => {
    navigate("/");
  };
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  const clickedMovie2 =
    bigMovieMatch2?.params.movieId &&
    topMovieData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch2.params.movieId
    );
  const clickedMovie3 =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Trailer>
            {isLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              <>
                <Video>
                  <ReactPlayer
                    url={makeTrailerPath(trailer?.results[0].key || "")}
                    volume={0.3}
                    controls={false}
                    playing={true}
                    muted={false}
                    loop={true}
                    width="100%"
                    height="calc(110vh)"
                    pip={false}
                    playsinline={false}
                  ></ReactPlayer>
                  <Banner>
                    <Title>{topMovieData?.results[0].title}</Title>
                    <Overview>{topMovieData?.results[0].overview}</Overview>
                  </Banner>
                </Video>
              </>
            )}
          </Trailer>
          <Slider>
            <SliderName>Now Playing</SliderName>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <NextPage onClick={increaseIndex}>
                <FaAngleRight />
              </NextPage>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      key={movie.id}
                      variants={boxVarints}
                      whileHover="hover"
                      initial="normal"
                      transition={{
                        type: "tween",
                      }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w400")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  style={{
                    top: scrollY.get() + 100,
                  }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>

          <Slider>
            <SliderName>Top Rated Movie</SliderName>
            <NextPage onClick={increaseIndex2}>
              <FaAngleRight />
            </NextPage>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving2}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index2}
              >
                {topMovieData?.results
                  .slice(1)
                  .slice(offset * index2, offset * index2 + offset)
                  .map((movie2) => (
                    <Box
                      layoutId={movie2.id + ""}
                      onClick={() => onBoxClicked2(movie2.id)}
                      key={movie2.id}
                      variants={boxVarints}
                      whileHover="hover"
                      initial="normal"
                      transition={{
                        type: "tween",
                      }}
                      bgphoto={makeImagePath2(movie2.backdrop_path, "w400")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie2.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch2 ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  style={{
                    top: scrollY.get() + 100,
                  }}
                  layoutId={bigMovieMatch2.params.movieId}
                >
                  {clickedMovie2 && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath2(
                            clickedMovie2.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie2.title}</BigTitle>
                      <BigOverview>{clickedMovie2.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
