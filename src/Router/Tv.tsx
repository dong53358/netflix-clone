import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getTvs, getTvVedio, IGetTvResult, IGetVideosResult } from "../api";
import { makeTrailerPath } from "../utils";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  FaInfoCircle,
  FaVolumeMute,
  FaVolumeUp,
  FaWindowClose,
} from "react-icons/fa";
import TvSlider from "../Components/tv/TvSlider";
import { useRecoilState, useRecoilValue } from "recoil";
import { mainMuteState, tvMainState } from "../Recoil/atom";
import { useMatch, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import TvDetail from "../Components/tv/TvDetail";

const Wrapper = styled.div`
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

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 68px;
  font-weight: 600;
  margin-right: 30px;
  margin-bottom: 20px;
`;

const MuteBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 60px;
  width: 60px;
  font-size: 35px;
  margin-left: 25px;
  margin-top: 15px;
  border: solid 2px white;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;
const Info = styled.div`
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 200px;
    background-color: rgba(91, 91, 90, 0.8);
    border-radius: 4px;
    border: none;
    color: white;
    font-size: 28px;
    font-weight: bold;
    &:hover {
      background-color: rgba(91, 91, 90, 0.3);
    }
    &:active {
      opacity: 0.8;
      border: 1px solid white;
    }
    span {
      margin-left: 10px;
      font-size: 23px;
    }
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
`;

const BigBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 48vw;
  height: 100vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 20px;
  z-index: 9999;
`;

const ModalCloseBtn = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 30px;
  &:hover {
    opacity: 0.7;
  }
  &:active {
    opacity: 1;
  }
`;
function Tv() {
  const { data: popularData, isLoading: popularDataLoding } =
    useQuery<IGetTvResult>(["tv", "popular"], () => getTvs("popular"));
  const tvMainId = useRecoilValue(tvMainState);
  const { data: tvTrailerData } = useQuery<IGetVideosResult>(["tv"], () =>
    getTvVedio(tvMainId)
  );

  const { data: nowData, isLoading: nowDataLoding } = useQuery<IGetTvResult>(
    ["tv", "on_the_air"],
    () => getTvs("on_the_air")
  );

  const { data: topTvData, isLoading: topTvDataLoding } =
    useQuery<IGetTvResult>(["tv", "top_rated"], () => getTvs("top_rated"));

  const [isMainMute, setIsMainMute] = useRecoilState(mainMuteState);
  const bigTvMatch = useMatch("/tv/:tvId");
  const navigate = useNavigate();
  const [netflix] = useState("rGrxaNUPozA");
  const onInfoClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
    setIsMainMute(true);
    //document.body.style.overflow = "hidden";
  };
  const mainMuteBtn = () => {
    setIsMainMute((prev) => !prev);
  };
  const onOverlayClick = () => {
    navigate("/tv");
    //document.body.style.overflow = "unset";
  };

  const { scrollY } = useScroll();
  //const setScrollY = useTransform(scrollY, (value) => value + 30);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
    setIsMainMute(true);
    //document.body.style.overflow = "hidden";
  };
  return (
    <Wrapper>
      {nowDataLoding && topTvDataLoding && popularDataLoding ? (
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
                    <title>TV-NETFLIX</title>
                  </Helmet>
                </HelmetProvider>
                <Video>
                  <ReactPlayer
                    url={
                      tvTrailerData?.results[0] === undefined
                        ? makeTrailerPath(netflix)
                        : makeTrailerPath(tvTrailerData?.results[0].key || "")
                    }
                    volume={isMainMute ? 0 : 0.3}
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
                    <Title>
                      {popularData?.results[1].name}
                      <MuteBtn onClick={mainMuteBtn}>
                        {isMainMute ? <FaVolumeMute /> : <FaVolumeUp />}
                      </MuteBtn>
                    </Title>
                    <Info>
                      <button
                        onClick={() => onInfoClicked(nowData?.results[0].id)}
                        type="button"
                      >
                        <FaInfoCircle />
                        <span>상세 정보</span>
                      </button>
                    </Info>
                  </Banner>
                </Video>
                <TvSlider
                  kind="on_the_air"
                  data={nowData}
                  onBoxClicked={onBoxClicked}
                />
                <TvSlider
                  kind="top_rated"
                  data={topTvData}
                  onBoxClicked={onBoxClicked}
                />
                <TvSlider
                  kind="popular"
                  data={popularData}
                  onBoxClicked={onBoxClicked}
                />
                <AnimatePresence>
                  {bigTvMatch && (
                    <>
                      <Overlay
                        onClick={onOverlayClick}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                      <BigBox
                        layoutId={bigTvMatch?.params.tvId}
                        style={{
                          top: scrollY.get() + 30,
                        }}
                      >
                        {bigTvMatch ? (
                          <TvDetail id={bigTvMatch.params.tvId} kind={"tv"} />
                        ) : null}
                        <ModalCloseBtn onClick={onOverlayClick}>
                          <FaWindowClose />
                        </ModalCloseBtn>
                      </BigBox>
                    </>
                  )}
                </AnimatePresence>
              </>
            )}
          </Trailer>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
