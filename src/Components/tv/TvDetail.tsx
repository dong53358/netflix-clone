import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import {
  castTv,
  getTvDetails,
  getTvVedio2,
  ICast,
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
  color: white;
  font-size: 50px;
  font-weight: 600;
`;

const BigBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
`;
const Video = styled.div`
  width: 100%;
  height: 55%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
const Banner = styled.div`
  width: 100%;
  height: 50vh;
  opacity: 1;
  position: absolute;
  background-position: center center;
`;
const BigTitle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 36px;
  position: absolute;
  bottom: 0px;
  z-index: 9999;
  font-weight: 600;
  padding: 10px 80px;
  span {
    margin: 0px 30px;
  }
`;

const MuteBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 60px;
  width: 60px;
  font-size: 22px;
  border: solid 2px white;
  margin-right: 20px;
  z-index: 9999;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const InfoDetail = styled.div`
  width: 100%;
  height: 45%;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
`;

const Detail = styled.div`
  display: flex;
  color: ${(props) => props.theme.white.lighter};
  font-size: 16px;
  line-height: 30px;
  padding: 0px 45px;
  margin-bottom: 20px;
  font-weight: 500;
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 65%;
  color: ${(props) => props.theme.white.lighter};
  margin-right: 20px;
  padding: 10px;
  div:first-child {
    margin-bottom: 30px;
    font-size: 18px;

    span {
      margin-right: 10px;
    }
  }
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  color: ${(props) => props.theme.white.lighter};
  padding: 5px;

  div {
    margin-bottom: 10px;
  }
`;

const Dark = styled.span`
  color: gray;
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
  const { data: castData, isLoading: castDataLoading } = useQuery<ICast>(
    ["cast"],
    () => castTv(id)
  );
  const [netflix, setNetflix] = useState("rGrxaNUPozA");
  const [isMute, setIsMute] = useRecoilState(muteState);

  const muteBtn = () => {
    setIsMute((prev) => !prev);
  };
  console.log(detailData);
  return (
    <AnimatePresence>
      {detailDataLoding && trailerDataLoding && castDataLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <BigBox>
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
                width="calc(120vw)"
                height="calc(120vh)"
                pip={false}
                playsinline={false}
              ></ReactPlayer>
              <Banner>
                <BigTitle>
                  <span>{detailData?.name}</span>
                  <MuteBtn onClick={muteBtn}>
                    {isMute ? <FaVolumeMute /> : <FaVolumeUp />}
                  </MuteBtn>
                </BigTitle>
              </Banner>
            </Video>
            <InfoDetail>
              <Detail>
                <Left>
                  <div>
                    <span>
                      <Dark>등록일자 :</Dark>
                      {detailData?.first_air_date}
                    </span>

                    <span>
                      <Dark>시즌 :</Dark>
                      {detailData?.number_of_seasons}개
                    </span>
                    <span>
                      <Dark>에피소드 :</Dark>
                      {detailData?.number_of_episodes}개
                    </span>
                  </div>
                  <div>
                    {detailData?.overview
                      ? detailData?.overview
                      : "등록되지 않음"}
                  </div>
                </Left>
                <Right>
                  <div>
                    <span>
                      <Dark>출연</Dark> :{" "}
                      {castData?.cast.slice(0, 5).map((cast) => (
                        <span key={cast?.id}>{cast?.name}, </span>
                      ))}
                    </span>
                  </div>
                  <div>
                    <Dark>장르</Dark> :{" "}
                    {detailData?.genres.map((genre) => (
                      <span key={genre?.id}>{genre?.name}, </span>
                    ))}
                  </div>
                </Right>
              </Detail>
            </InfoDetail>
          </BigBox>
        </>
      )}
    </AnimatePresence>
  );
}

export default TvDetail;
