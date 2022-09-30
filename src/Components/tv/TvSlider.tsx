import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaStar } from "react-icons/fa";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { IGetTvResult } from "../../api";
import useWindowDimensions from "../../hooks/useWidowDimensions";
import { mainMuteState } from "../../Recoil/atom";
import { makeImagePath } from "../../utils";
import TvDetail from "./TvDetail";

const Slider = styled.div`
  position: relative;
  height: 200px;
  top: -100px;
  margin-bottom: 100px;
`;

const SliderName = styled.div`
  font-size: 30px;
  font-weight: 600;
  padding-left: 60px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
  padding: 15px 40px;
`;

const BeforePage = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  height: 101%;
  width: 40px;
  position: absolute;
  left: 0px;
  top: 25%;
  z-index: 10;
  color: white;
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
`;

const NextPage = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  height: 101%;
  width: 40px;
  position: absolute;
  right: 0px;
  top: 25%;
  z-index: 10;
  color: white;
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  height: 200px;
  color: white;
  font-size: 20px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  position: relative;
  &:hover {
    z-index: 50;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  div:first-child {
    color: white;
    text-shadow: 2px 2px 2px gray;
    text-align: center;
  }
`;

const Info = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-size: cover;

  div:first-child {
    margin-right: 6px;
    font-size: 18px;
    color: red;
  }
  div:last-child {
    font-size: 20px;
    color: red;
    margin-bottom: 3px;
  }
`;

const rowVariants = {
  hidden: ({ width, isReverse }: { width: number; isReverse: boolean }) => ({
    x: isReverse ? -width + 75 : width - 75,
  }),
  visible: {
    x: 0,
  },
  exit: ({ width, isReverse }: { width: number; isReverse: boolean }) => ({
    x: isReverse ? width - 75 : -width + 75,
  }),
};

const boxVarints = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      typetrailer: "tween",
    },
  },
};

const offset = 6;

interface IProps {
  kind: string;
  data?: IGetTvResult;
  onBoxClicked: Function;
}

function TvSlider({ kind, data, onBoxClicked }: IProps) {
  const [titmeName, setTitleName] = useState("");

  useEffect(() => {
    switch (kind) {
      case "on_the_air":
        setTitleName("최신 TV 프로그램");
        break;
      case "top_rated":
        setTitleName("최고 평점 TV 프로그램");
        break;
      case "popular":
        setTitleName("인기 TV 프로그램");
        break;
    }
  }, [kind]);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isReverse, setIsReverse] = useState(false);
  const width = useWindowDimensions();
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setIsReverse(() => true);
      toggleLeaving();
      const totalMocies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMocies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setIsReverse(() => false);
      toggleLeaving();
      const totalMocies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMocies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  return (
    <>
      <Slider>
        <SliderName>{titmeName}</SliderName>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={{ width, isReverse }}
        >
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.6 }}
            key={index}
            custom={{ width, isReverse }}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((tv) => (
                <Box
                  layoutId={tv.id + kind}
                  onClick={() => onBoxClicked(tv.id)}
                  key={tv.id}
                  variants={boxVarints}
                  whileHover="hover"
                  initial="normal"
                  transition={{
                    type: "tween",
                  }}
                  bgphoto={
                    tv.backdrop_path
                      ? makeImagePath(tv.backdrop_path, "w400")
                      : "assets/netflix.png"
                  }
                >
                  <div>{tv.name}</div>
                  <Info variants={infoVariants}>
                    <div>
                      <FaStar />
                    </div>
                    <div>{tv.vote_average}</div>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <BeforePage onClick={decreaseIndex}>
          <FaAngleLeft />
        </BeforePage>
        <NextPage onClick={increaseIndex}>
          <FaAngleRight />
        </NextPage>
      </Slider>
    </>
  );
}

export default TvSlider;
