import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaAngleRight, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { IGetMoviesResult } from "../../api";
import { mainMuteState, scrollState } from "../../Recoil/atom";
import { makeImagePath } from "../../utils";

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

const NextPage = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  height: 101%;
  width: 40px;
  position: absolute;
  right: 40px;
  top: 25%;
  z-index: 10;
  color: black;
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
  hidden: {
    x: window.outerWidth - 75,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 75,
  },
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
  data?: IGetMoviesResult;
  onBoxClicked: Function;
}

function MovieSlider({ kind, data, onBoxClicked }: IProps) {
  const [titmeName, setTitleName] = useState("");

  useEffect(() => {
    switch (kind) {
      case "now":
        setTitleName("상영중인 영화");
        break;
      case "top":
        setTitleName("평점높은 영화");
        break;
      case "upcomming":
        setTitleName("개봉예정 영화");
        break;
    }
  }, [kind]);

  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [scrollFixed, setScrollFixed] = useRecoilState(scrollState);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMocies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMocies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const [isMainMute, setIsMainMute] = useRecoilState(mainMuteState);
  // const onBoxClicked = (movieId: number) => {
  //   navigate(`/movies/${movieId}`);
  //   setIsMainMute(true);
  //   setScrollFixed(true);
  //   //document.body.style.overflow = "hidden";
  // };
  return (
    <>
      <Slider>
        <SliderName>{titmeName}</SliderName>
        <NextPage onClick={increaseIndex}>
          <FaAngleRight />
        </NextPage>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ""}
                  onClick={() => onBoxClicked(movie.id)}
                  key={movie.id}
                  variants={boxVarints}
                  whileHover="hover"
                  initial="normal"
                  transition={{
                    type: "tween",
                  }}
                  bgphoto={
                    movie.backdrop_path
                      ? makeImagePath(movie.backdrop_path, "w400")
                      : "assets/netflix.png"
                  }
                >
                  <div>{movie.title}</div>
                  <Info variants={infoVariants}>
                    <div>
                      <FaStar />
                    </div>
                    <div>{movie.vote_average}</div>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
    </>
  );
}

export default MovieSlider;
