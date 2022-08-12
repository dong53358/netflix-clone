import { AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovieDetails,
  getMovieVedio2,
  getTvVedio2,
  IGetDetailMovies,
  IGetVideosResult,
} from "../../api";
import { makeTrailerPath } from "../../utils";

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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 100;
`;

const Banner = styled.div`
  width: 100%;
  height: 100vh;
  opacity: 0;
  position: absolute;
  background-position: center center;
`;

const BigTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 36px;
  position: relative;
  top: -80px;
  font-weight: 600;
  span:first-child {
    margin-right: 30px;
  }
  span:nth-child(2) {
    margin-right: 30px;
  }
  span:last-child {
    font-size: 17px;
    color: red;
  }
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 20px;
  position: relative;
  top: -80px;
`;

interface IProps {
  id: string;
}

function SearchDetail({ id }: IProps) {
  const { data: detailData, isLoading: detailDataLoding } =
    useQuery<IGetDetailMovies>(["movie"], () => getMovieDetails(id));
  const { data: movieVideoData, isLoading: movieVideoDataLoding } =
    useQuery<IGetVideosResult>(["videos"], () => getMovieVedio2(id));
  const { data: tvVideoData, isLoading: tvVideoDataLoding } =
    useQuery<IGetVideosResult>(["videos"], () => getTvVedio2(id));
  const NETFLIX = "rGrxaNUPozA";
  return (
    <AnimatePresence>
      {detailDataLoding && movieVideoDataLoding && tvVideoDataLoding ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Video>
            <ReactPlayer
              url={
                movieVideoData?.results[0] !== undefined
                  ? makeTrailerPath(movieVideoData?.results[0].key)
                  : tvVideoData?.results[0] !== undefined
                  ? makeTrailerPath(tvVideoData?.results[0].key)
                  : makeTrailerPath(NETFLIX)
              }
              volume={0.3}
              controls={false}
              playing={true}
              muted={false}
              loop={true}
              width="100%"
              height="100%"
              pip={false}
              playsinline={false}
            ></ReactPlayer>
            <Banner />
            <div>
              <BigTitle>
                <span>{detailData.title}</span>
                <span>{detailData.runtime}분</span>
                <span>
                  {detailData.genres.map((genre) => (
                    <span key={genre.id}>{genre.name}</span>
                  ))}
                </span>
              </BigTitle>
              <BigOverview>{detailData.overview}</BigOverview>
            </div>
          </Video>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchDetail;
