import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  getMovieVedio,
  getTvs,
  IGetMoviesResult,
  IGetTvResult,
  IGetVideosResult,
} from "../api";
import { makeTrailerPath } from "../utils";
import { Helmet, HelmetProvider } from "react-helmet-async";
import MovieSlider from "../Components/movie/MovieSlider";

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
  font-size: 68px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  font-size: 25px;
  font-weight: 300;
  width: 50%;
  margin-bottom: 10px;
`;

function Home() {
  const { data: trailerData, isLoading: trailerDataLoding } =
    useQuery<IGetVideosResult>(["videos"], () => getMovieVedio("616037"));
  const { data: nowData, isLoading: nowDataLoding } =
    useQuery<IGetMoviesResult>(["movie", "now"], () =>
      getMovies("now_playing")
    );
  const { data: topMovieData, isLoading: topMovieDataLoding } =
    useQuery<IGetMoviesResult>(["movie", "top"], () => getMovies("top_rated"));

  const { data: upcomingData, isLoading: upcomingDataLoding } =
    useQuery<IGetMoviesResult>(["movie", "upcoming"], () =>
      getMovies("upcoming")
    );

  const { data: popularData } = useQuery<IGetTvResult>(["tv", "popular"], () =>
    getTvs("popular")
  );

  localStorage.setItem("localId", String(popularData?.results[1].id));

  return (
    <Wrapper>
      {trailerDataLoding &&
      nowDataLoding &&
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
                    <Title>{nowData?.results[0].title}</Title>
                    <Overview>{nowData?.results[0].overview}</Overview>
                  </Banner>
                </Video>
                <MovieSlider kind="now" data={nowData} />
                <MovieSlider kind="top" data={topMovieData} />
                <MovieSlider kind="upcomming" data={upcomingData} />
              </>
            )}
          </Trailer>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
