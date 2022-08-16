import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovieDetails,
  getMovieVedio2,
  getTvDetails,
  getTvVedio2,
  IGetDetailMovies,
  IGetDetailTvs,
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
  //justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 100;
`;

const Banner = styled.div`
  width: 100%;
  height: 500px;
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
  font-size: 18px;
  position: relative;
  top: -80px;
`;

interface IProps {
  id: string;
}

function SearchDetail({ id }: IProps) {
  const { data: movieDetailData, isLoading: movieDetailDataLoding } =
    useQuery<IGetDetailMovies>(["movie"], () => getMovieDetails(id));
  const { data: tvDetailData, isLoading: tvDetailDataLoding } =
    useQuery<IGetDetailTvs>(["movie"], () => getTvDetails(id));
  const { data: movieVideoData, isLoading: movieVideoDataLoding } =
    useQuery<IGetVideosResult>(["videos"], () => getMovieVedio2(id));
  const { data: tvVideoData, isLoading: tvVideoDataLoding } =
    useQuery<IGetVideosResult>(["tv"], () => getTvVedio2(id));
  const [netflix, setNetflix] = useState("rGrxaNUPozA");

  return (
    <AnimatePresence>
      {movieDetailDataLoding &&
      tvDetailDataLoding &&
      movieVideoDataLoding &&
      tvVideoDataLoding ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Video>
            {movieVideoData?.success === false &&
            tvVideoData?.success === false ? (
              <div>자료없음</div>
            ) : tvVideoData?.success === false ? (
              <ReactPlayer
                url={
                  movieVideoData?.results[0]
                    ? makeTrailerPath(movieVideoData?.results[0].key)
                    : makeTrailerPath(netflix)
                }
                volume={0.3}
                controls={false}
                playing={true}
                muted={false}
                loop={true}
                width="100%"
                height="500px"
                pip={false}
                playsinline={false}
              ></ReactPlayer>
            ) : tvVideoData?.results[0] === undefined ? (
              <ReactPlayer
                url={
                  movieVideoData?.success === false
                    ? makeTrailerPath(netflix)
                    : movieVideoData?.results[0]
                    ? makeTrailerPath(movieVideoData?.results[0].key)
                    : makeTrailerPath(netflix)
                }
                volume={0.3}
                controls={false}
                playing={true}
                muted={false}
                loop={true}
                width="100%"
                height="500px"
                pip={false}
                playsinline={false}
              ></ReactPlayer>
            ) : null}
            {movieVideoData?.success === false &&
            tvVideoData?.success === false ? (
              <div>자료없음</div>
            ) : movieVideoData?.success === false ? (
              <ReactPlayer
                url={
                  tvVideoData?.results[0]
                    ? makeTrailerPath(tvVideoData?.results[0].key)
                    : makeTrailerPath(netflix)
                }
                volume={0.3}
                controls={false}
                playing={true}
                muted={false}
                loop={true}
                width="100%"
                height="500px"
                pip={false}
                playsinline={false}
              ></ReactPlayer>
            ) : null}
            <Banner />
            {movieVideoData?.success === false &&
            tvVideoData?.success === false ? null : (
              <div>
                <BigTitle>
                  <span>
                    {movieDetailData?.title}
                    {tvDetailData?.name}
                  </span>
                  <span>{movieDetailData?.runtime}분</span>
                  <span>
                    {movieDetailData?.genres ? (
                      movieDetailData?.genres.map((genre) => (
                        <span key={genre.id}>{genre.name}</span>
                      ))
                    ) : tvDetailData?.genres ? (
                      tvDetailData?.genres.map((genre) => (
                        <span key={genre.id}>{genre.name}</span>
                      ))
                    ) : (
                      <div>자료없음</div>
                    )}
                  </span>
                </BigTitle>
                <BigOverview>
                  {movieDetailData?.overview}
                  {tvDetailData?.overview}
                </BigOverview>
              </div>
            )}
          </Video>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchDetail;
