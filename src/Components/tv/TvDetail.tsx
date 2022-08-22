import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import {
  getTvDetails,
  getTvVedio2,
  IGetDetailTvs,
  IGetVideosResult,
} from "../../api";
import { useQuery } from "react-query";
import { makeTrailerPath } from "../../utils";
import ReactPlayer from "react-player";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { muteState } from "../../Recoil/atom";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

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
  // justify-content: center;
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
  font-size: 34px;
  position: relative;
  top: -80px;
  font-weight: 600;
  span:first-child {
    margin-right: 30px;
  }
  span:last-child {
    font-size: 15px;
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
  font-size: 20px;
  border: solid 2px white;
  margin-right: 20px;
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
  const [netflix, setNetflix] = useState("rGrxaNUPozA");
  const [isMute, setIsMute] = useRecoilState(muteState);
  const muteBtn = () => {
    setIsMute((prev) => !prev);
  };
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
            <Banner />
            <div>
              <BigTitle>
                <span>{detailData?.name}</span>
                <MuteBtn onClick={muteBtn}>
                  {isMute ? <FaVolumeMute /> : <FaVolumeUp />}
                </MuteBtn>
                <span>
                  {detailData?.genres.map((genre) => (
                    <span key={genre?.id}>{genre.name}</span>
                  ))}
                </span>
              </BigTitle>
              <BigOverview>
                {detailData?.overview ? detailData?.overview : "등록되지 않음"}
              </BigOverview>
            </div>
          </Video>
        </>
      )}
    </AnimatePresence>
  );
}

export default TvDetail;
