import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  font-size: 65px;
  font-weight: 600;
  margin-top: 250px;
`;

const BgImage = styled.div<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  position: absolute;
  top: 0;
  width: 100vw;
  height: 90vh;
  z-index: -1;
  opacity: 0.4;
`;

const Intro = styled.div`
  margin-bottom: 20px;
`;

const Start = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 100px;
`;

const HomeLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  height: 70px;
  font-size: 33px;
  font-weight: 400;
  background-color: red;
  padding: 15px;
  padding-left: 25px;
`;
const Footer = styled.div`
  width: 100%;
  margin-top: 200px;
  font-size: 14px;
  font-weight: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Line = styled.div`
  width: 100%;
  height: 10px;
  background-color: #222222;
  margin-bottom: 100px;
`;

const FooterInfo = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 50px;
  opacity: 0.5;
`;

function Main() {
  return (
    <>
      <Wrapper>
        <Intro>영화와 시리즈를</Intro>
        <Intro>무제한으로</Intro>
        <Start>
          <Link to={"/movies"}>
            <HomeLink>
              시작하기
              <FaAngleRight />
            </HomeLink>
          </Link>
        </Start>

        <Footer>
          <Line></Line>
          <FooterInfo>
            <span>넷플릭스 대한민국</span>
            <span>
              넷플릭스서비시스코리아 유한회사 통신판매업신고번호:
              제0000-서울종로-0000호 전화번호: 010-000-0000
            </span>
            <span>대표: rbdyd</span>
            <span> 이메일 주소: dong53358@naver.com</span>
            <span>
              주소: 대한민국 서울특별시 종로구 0000로 00, 센트로폴리스 A동 0층
              우편번호 00000
            </span>
            <span>사업자등록번호: 000-00-00000</span>
            <span>클라우드 호스팅: Amazon Web Services Inc.</span>
            <span>공정거래위원회 웹사이트</span>
          </FooterInfo>
        </Footer>
      </Wrapper>
      <BgImage bgphoto={"assets/netflixMain.jpg"}></BgImage>
    </>
  );
}

export default Main;
