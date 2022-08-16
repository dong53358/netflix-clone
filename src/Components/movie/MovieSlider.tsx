import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { FaAngleRight, FaStar } from "react-icons/fa";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult } from "../../api";
import { makeImagePath } from "../../utils";
import MovieDetail from "./MovieDetail";

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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  //overflow: hidden;
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
}

function MovieSlider({ kind, data }: IProps) {
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
  const bigMovieMatch = useMatch("/movies/:movieId");
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMocies = data.results.length - 1;
      const maxIndex = Math.floor(totalMocies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const { scrollY } = useScroll();
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => {
    navigate("/");
  };
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
                      : "/assets/netflix.png"
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
      <AnimatePresence>
        {bigMovieMatch && (
          <>
            <Overlay
              onClick={onOverlayClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigBox
              layoutId={bigMovieMatch?.params.movieId}
              style={{
                top: scrollY.get() + 50,
              }}
            >
              {bigMovieMatch ? (
                <MovieDetail id={bigMovieMatch.params.movieId} kind={kind} />
              ) : null}
            </BigBox>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MovieSlider;
