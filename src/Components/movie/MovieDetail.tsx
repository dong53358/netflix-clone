import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import {
  getMovieDetails,
  getMovieVedio2,
  IGetDetailMovies,
  IGetVideosResult,
} from "../../api";
import { useQuery } from "react-query";
import { makeTrailerPath } from "../../utils";
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
  //justify-content: center;
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
  kind: string;
}

function MovieDetail({ id, kind }: IProps) {
  const { data: detailData, isLoading: detailDataLoding } =
    useQuery<IGetDetailMovies>(["movie", `${kind}_detail`], () =>
      getMovieDetails(id)
    );

  const { data: trailerData, isLoading: trailerDataLoding } =
    useQuery<IGetVideosResult>(["videos", `${id}_videos`], () =>
      getMovieVedio2(id)
    );
  const [netflix, setNetflix] = useState("rGrxaNUPozA");

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
                  ? makeTrailerPath(netflix)
                  : makeTrailerPath(trailerData?.results[0].key || "")
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
            <Banner />
            <div>
              <BigTitle>
                <span>{detailData?.title}</span>
                <span>{detailData?.runtime}분</span>
                <span>
                  {detailData?.genres.map((genre) => (
                    <span key={genre?.id}>{genre?.name}</span>
                  ))}
                </span>
              </BigTitle>
              <BigOverview>{detailData?.overview}</BigOverview>
            </div>
          </Video>
        </>
      )}
    </AnimatePresence>
  );
}

export default MovieDetail;
