import { useQuery } from "react-query";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { getMovieVedio, IGetVideosResult } from "../api";
import { makeTrailerPath } from "../utils";

const TvShow = styled.div`
  min-width: 1400px;
  height: 200vh;
  background-color: rgba(207, 206, 206, 0.9);
`;

const Loader = styled.div`
  width: 100%;
  font-size: 50px;
  color: black;
`;

const Video = styled.div`
  width: 100%;
  height: 100vh;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Banner = styled.div`
  width: 100%;
  height: 100vh;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  position: absolute;
`;

function Tv() {
  localStorage.setItem("movieId", "616037");
  const stateMovieId = localStorage.getItem("movieId");
  const { data: trailer, isLoading } = useQuery<IGetVideosResult>(
    ["videos"],
    () => getMovieVedio(String(stateMovieId))
  );
  console.log(stateMovieId);
  return (
    <TvShow>
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
            <Banner />
          </Video>
        </>
      )}
    </TvShow>
  );
}

export default Tv;
