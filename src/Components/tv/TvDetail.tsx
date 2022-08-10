import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  getMovieVedio,
  getMovieVedio2,
  getTvDetails,
  getTvVedio2,
  IGetDetailMovies,
  IGetDetailTvs,
  IGetVideosResult,
} from "../../api";
import { useQuery } from "react-query";
import { makeImagePath, makeTrailerPath } from "../../utils";
import ReactPlayer from "react-player";
import { useState } from "react";

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
  background-color: yellow;
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
  kind: string;
}

function TvDetail({ id, kind }: IProps) {
  const { data: detailData, isLoading: detailDataLoding } =
    useQuery<IGetDetailTvs>(["movie", `${kind}_detail`], () =>
      getTvDetails(id)
    );

  const { data: trailerData, isLoading: trailerDataLoding } =
    useQuery<IGetVideosResult>(["videos", `{id}_videos`], () =>
      getTvVedio2(id)
    );
  const NETFLIX = "rGrxaNUPozA";
  return (
    <AnimatePresence>
      {detailDataLoding && trailerDataLoding ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Video>
            <ReactPlayer
              url={
                trailerData?.results[0] === undefined
                  ? makeTrailerPath(NETFLIX)
                  : makeTrailerPath(trailerData?.results[0].key || "")
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
                <span>{detailData.name}</span>
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

export default TvDetail;
