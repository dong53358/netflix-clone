import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  getMovieVedio,
  IGetMoviesResult,
  IGetVideosResult,
} from "../api";
import { makeTrailerPath } from "../utils";
import { Helmet, HelmetProvider } from "react-helmet-async";
import MovieSlider from "../Components/movie/MovieSlider";
import { useRecoilState, useRecoilValue } from "recoil";
import { mainMuteState, movieMainState } from "../Recoil/atom";
import {
  FaInfoCircle,
  FaVolumeMute,
  FaVolumeUp,
  FaWindowClose,
} from "react-icons/fa";
import { useMatch, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import MovieDetail from "../Components/movie/MovieDetail";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  height: 200vh;
  width: 100vw;
`;

const Trailer = styled.div`
  width: 100vw;
  height: 100vh;
  margin-bottom: 10px;
`;

const Loader = styled.div`
  height: 50vh;
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
  display: flex;
  align-items: center;
  font-size: 68px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const MuteBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid white;
  height: 60px;
  width: 60px;
  font-size: 35px;
  margin-left: 50px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const Overview = styled.p`
  font-size: 25px;
  font-weight: 300;
  width: 50%;
  margin-bottom: 20px;
`;

const Info = styled.div`
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 200px;
    background-color: rgba(91, 91, 90, 0.8);
    border-radius: 4px;
    border: none;
    color: white;
    font-size: 28px;
    font-weight: bold;
    &:hover {
      background-color: rgba(91, 91, 90, 0.3);
    }
    &:active {
      opacity: 0.8;
      border: 1px solid white;
    }
    span {
      margin-left: 10px;
      font-size: 23px;
    }
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
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
`;

const ModalCloseBtn = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 30px;
  &:hover {
    opacity: 0.7;
  }
  &:active {
    opacity: 1;
  }
`;

function Home() {
  const { data: nowData, isLoading: nowDataLoding } =
    useQuery<IGetMoviesResult>(["movie", "now"], () =>
      getMovies("now_playing")
    );
  const movieMainId = useRecoilValue(movieMainState);
  const { data: trailerData, isLoading: trailerDataLoding } =
    useQuery<IGetVideosResult>(["videos"], () => getMovieVedio(movieMainId));
  const { data: topMovieData, isLoading: topMovieDataLoding } =
    useQuery<IGetMoviesResult>(["movie", "top"], () => getMovies("top_rated"));
  const { data: upcomingData, isLoading: upcomingDataLoding } =
    useQuery<IGetMoviesResult>(["movie", "upcoming"], () =>
      getMovies("upcoming")
    );
  const [isMainMute, setIsMainMute] = useRecoilState(mainMuteState);
  const bigMovieMatch = useMatch("/movies/:movieId");
  const navigate = useNavigate();
  const onInfoClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
    setIsMainMute(true);
  };
  const mainMuteBtn = () => {
    setIsMainMute((prev) => !prev);
  };

  const onOverlayClick = () => {
    navigate("/movies");
  };

  const { scrollY } = useScroll();
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
    setIsMainMute(true);
  };
  return (
    <Wrapper>
      {nowDataLoding &&
      trailerDataLoding &&
      topMovieDataLoding &&
      upcomingDataLoding ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Trailer>
            {nowDataLoding ? (
              <Loader>Loading...</Loader>
            ) : (
              <>
                <HelmetProvider>
                  <Helmet>
                    <title>MOVIE-NETFLIX</title>
                  </Helmet>
                </HelmetProvider>
                <Video>
                  <ReactPlayer
                    url={makeTrailerPath(trailerData?.results[0].key || "")}
                    volume={isMainMute ? 0 : 0.3}
                    controls={false}
                    playing={true}
                    muted={false}
                    loop={true}
                    width="calc(120vw)"
                    height="calc(120vh)"
                    pip={false}
                    playsinline={false}
                  ></ReactPlayer>
                  <Banner>
                    <Title>
                      {nowData?.results[1].title}
                      <MuteBtn onClick={mainMuteBtn}>
                        {isMainMute ? <FaVolumeMute /> : <FaVolumeUp />}
                      </MuteBtn>
                    </Title>
                    <Overview>{nowData?.results[1].overview}</Overview>
                    <Info>
                      <button
                        onClick={() => onInfoClicked(nowData?.results[1].id)}
                        type="button"
                      >
                        <FaInfoCircle />
                        <span>상세 정보</span>
                      </button>
                    </Info>
                  </Banner>
                </Video>
                <MovieSlider
                  kind="now"
                  data={nowData}
                  onBoxClicked={onBoxClicked}
                />
                <MovieSlider
                  kind="top"
                  data={topMovieData}
                  onBoxClicked={onBoxClicked}
                />
                <MovieSlider
                  kind="upcomming"
                  data={upcomingData}
                  onBoxClicked={onBoxClicked}
                />
                <AnimatePresence>
                  {bigMovieMatch && (
                    <>
                      <Overlay
                        onClick={onOverlayClick}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                      <BigBox
                        layoutId={bigMovieMatch?.params.movieId}
                        style={{
                          top: scrollY.get() + 30,
                        }}
                      >
                        {bigMovieMatch ? (
                          <MovieDetail
                            id={bigMovieMatch.params.movieId}
                            kind={"movie"}
                          />
                        ) : null}
                        <ModalCloseBtn onClick={onOverlayClick}>
                          <FaWindowClose />
                        </ModalCloseBtn>
                      </BigBox>
                    </>
                  )}
                </AnimatePresence>
              </>
            )}
          </Trailer>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
