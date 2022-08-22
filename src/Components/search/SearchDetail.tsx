import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
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
import { muteState } from "../../Recoil/atom";
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
  font-size: 33px;
  position: relative;
  top: -80px;
  font-weight: 600;
  span:first-child {
    margin-right: 20px;
  }
  span:nth-child(3) {
    margin-right: 20px;
  }
  span:last-child {
    font-size: 14px;
    color: red;
  }
`;

const MuteBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 60px;
  width: 60px;
  font-size: 19px;
  border: solid 2px white;
  margin-right: 10px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.8);
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
  const [isMute, setIsMute] = useRecoilState(muteState);
  const muteBtn = () => {
    setIsMute((prev) => !prev);
  };
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
                volume={isMute ? 0 : 0.3}
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
                volume={isMute ? 0 : 0.3}
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
                volume={isMute ? 0 : 0.3}
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
                  <MuteBtn onClick={muteBtn}>
                    {isMute ? <FaVolumeMute /> : <FaVolumeUp />}
                  </MuteBtn>
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
