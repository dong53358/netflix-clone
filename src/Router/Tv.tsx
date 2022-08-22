import ReactPlayer from "react-player";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getTvs, getTvVedio, IGetTvResult, IGetVideosResult } from "../api";
import { makeTrailerPath } from "../utils";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { FaStar, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import TvSlider from "../Components/tv/TvSlider";
import { useRecoilState } from "recoil";
import { muteState } from "../Recoil/atom";

const Wrapper = styled.div`
  background-color: black;
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
  align-items: flex-end;
  color: white;
  padding-bottom: 150px;
  padding-left: 60px;
  text-shadow: 4px 4px 4px gray;
`;

const Title = styled.div`
  font-size: 68px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-right: 30px;
`;

const MuteBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 60px;
  width: 60px;
  font-size: 35px;
  margin-left: 10px;
  border: solid 2px white;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const Overview = styled.div`
  display: flex;
  align-items: center;
  font-size: 40px;
  font-weight: 600;
  width: 50%;
  margin-bottom: 30px;
  color: red;
`;

function Tv() {
  const { data: popularData, isLoading: popularDataLoding } =
    useQuery<IGetTvResult>(["tv", "popular"], () => getTvs("popular"));

  const { data: tvTrailerData } = useQuery<IGetVideosResult>(["tv"], () =>
    getTvVedio("66732")
  );

  const { data: nowData, isLoading: nowDataLoding } = useQuery<IGetTvResult>(
    ["tv", "on_the_air"],
    () => getTvs("on_the_air")
  );

  const { data: topTvData, isLoading: topTvDataLoding } =
    useQuery<IGetTvResult>(["tv", "top_rated"], () => getTvs("top_rated"));

  const [isMute, setIsMute] = useRecoilState(muteState);
  const muteBtn = () => {
    setIsMute((prev) => !prev);
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
                    url={makeTrailerPath(tvTrailerData?.results[0].key || "")}
                    volume={isMute ? 0 : 0.3}
                    controls={false}
                    playing={true}
                    muted={false}
                    loop={true}
                    width="100%"
                    height="calc(110vh)"
                    pip={false}
                    playsinline={false}
                  ></ReactPlayer>
                  <Banner>
                    <Title>{popularData?.results[1].name}</Title>
                    <MuteBtn onClick={muteBtn}>
                      {isMute ? <FaVolumeMute /> : <FaVolumeUp />}
                    </MuteBtn>
                    <Overview>
                      <FaStar />
                      {popularData?.results[1].vote_average}
                    </Overview>
                  </Banner>
                </Video>
                <TvSlider kind="on_the_air" data={nowData} />
                <TvSlider kind="top_rated" data={topTvData} />
                <TvSlider kind="popular" data={popularData} />
              </>
            )}
          </Trailer>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;