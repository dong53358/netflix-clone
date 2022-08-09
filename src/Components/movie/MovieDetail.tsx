import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  getMovieVedio,
  getMovieVedio2,
  IGetDetailMovies,
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
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
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
  span:first-child {
    margin-right: 30px;
  }
  span:last-child {
    font-size: 28px;
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

function MovieDetail({ id, kind }: IProps) {
  const { data: detailData, isLoading: detailDataLoding } =
    useQuery<IGetDetailMovies>(["movie", `${kind}_detail`], () =>
      getMovieDetails(id)
    );

  const { data: trailerData, isLoading: trailerDataLoding } =
    useQuery<IGetVideosResult>(["videos", `{id}_videos`], () =>
      getMovieVedio2(id)
    );
  const NETFLIX = "rGrxaNUPozA";
  const [isData, setIsdata] = useState(true);
  if (trailerData?.results[0] === null) {
    setIsdata(false);
  }
  return (
    <AnimatePresence>
      {detailDataLoding && trailerDataLoding ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Video>
            <ReactPlayer
              url={makeTrailerPath(
                isData ? trailerData?.results[0].key : "rGrxaNUPozA"
              )}
              volume={0.3}
              controls={false}
              playing={true}
              muted={false}
              loop={true}
              width="100%"
              height="600px"
              //pip={false}
              //playsinline={false}
            ></ReactPlayer>
          </Video>
          <div>
            <BigTitle>
              <span>{detailData.title}</span>
              <span>{detailData.runtime}분</span>
            </BigTitle>
            <BigOverview>{detailData.overview}</BigOverview>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MovieDetail;
