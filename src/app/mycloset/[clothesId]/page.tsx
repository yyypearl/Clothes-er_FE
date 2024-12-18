"use client";

import AuthAxios from "@/api/authAxios";
import Header from "@/components/common/Header";
import Bottom from "@/components/home/Bottom";
import Profile from "@/components/home/Profile";
import { Gender, getGenderLabel } from "@/interface/Gender";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "../../../styles/slick.css";
import "../../../styles/slick-theme.css";
import NextArrow from "@/components/common/NextArrow";
import PrevArrow from "@/components/common/PrevArrow";
import MoreBox from "@/components/common/MoreBox";
import Modal from "@/components/common/Modal";
import { formatPrice } from "@/lib/formatPrice";
import Loading from "@/components/common/Loading";
import {
  SkeletonText,
  SkeletonCircle,
  SkeletonBox,
  SkeletonDiv,
  SkeletonProfile,
} from "@/components/common/Skeleton";
import { getIsSuspended } from "@/util/storage";

interface PostInfo {
  id: number;
  rentalId: number;
  userSid: string;
  profileUrl: string;
  nickname: string;
  isWriter: boolean;
  isWithdrawn: boolean;
  follower: number;
  followee: number;
  imgUrls: string[];
  name: string;
  description: string;
  gender: Gender;
  category: string;
  style: String;
  price: number;
  brand: string;
  size: string;
  shoppingUrl: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const router = useRouter();
  const { clothesId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [menu, setMenu] = useState(false);
  const [postInfo, setPostInfo] = useState<PostInfo>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const [isSuspended, setIsSuspended] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const suspended = getIsSuspended();
      setIsSuspended(suspended);
    }
  }, []);

  const handleBackButtonClick = () => {
    router.back();
  };

  const handleMoreMenu = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    setIsLoading(true);
    AuthAxios.get(`/api/v1/clothes/${clothesId}`)
      .then((response) => {
        const data = response.data.result;
        setPostInfo(data);
        console.log(data);
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  }, [clothesId]);

  const handleModifyClick = () => {
    router.push(`/mycloset/${clothesId}/modify`);
  };

  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  const handleSubmitDelete = () => {
    AuthAxios.delete(`/api/v1/clothes/${clothesId}`)
      .then((response) => {
        const data = response.data.result;
        setDeleteModal(true);
        router.push("/mycloset");
        console.log(data);
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Layout>
        {isLoading && (
          <LoadingOverlay>
            {/* <Overlay /> */}
            <Loading />
          </LoadingOverlay>
        )}
        <Container>
          <Head>
            <Header />
            <Top>
              <Image
                src="/assets/icons/ic_arrow.svg"
                width={24}
                height={24}
                alt="back"
                onClick={handleBackButtonClick}
                style={{ cursor: "pointer" }}
              />
              나의 옷장
              {isSuspended === "true" ? (
                <div />
              ) : (
                <Menu>
                  <Image
                    src="/assets/icons/ic_more_vertical.svg"
                    width={24}
                    height={24}
                    alt="more"
                    onClick={handleMoreMenu}
                    style={{ cursor: "pointer" }}
                  />
                  {menu && (
                    <MoreBox
                      type="me"
                      modifyOnClick={handleModifyClick}
                      deleteOnClick={handleDeleteClick}
                    />
                  )}
                </Menu>
              )}
            </Top>
          </Head>
          <Content>
            {!isLoading ? (
              <>
                {postInfo?.imgUrls && postInfo?.imgUrls?.length > 1 ? (
                  <ImageSlide>
                    <StyledSlider
                      dots={true}
                      infinite={true}
                      speed={500}
                      slidesToShow={1}
                      slidesToScroll={1}
                      prevArrow={
                        <Div>
                          <PrevArrow />
                        </Div>
                      }
                      nextArrow={
                        <DivNext>
                          <NextArrow />
                        </DivNext>
                      }
                    >
                      {postInfo?.imgUrls?.map((url, index) => (
                        <ImageBox key={index}>
                          <Image
                            src={url}
                            alt={`image-${index}`}
                            fill
                            priority
                          />
                        </ImageBox>
                      ))}
                    </StyledSlider>
                  </ImageSlide>
                ) : (
                  <>
                    {postInfo?.imgUrls?.map((url, index) => (
                      <ImageBox key={index}>
                        <Image src={url} alt={`image-${index}`} fill priority />
                      </ImageBox>
                    ))}
                  </>
                )}
                <Profile
                  userSid={postInfo?.userSid || ""}
                  nickname={postInfo?.nickname ? postInfo.nickname : ""}
                  profileUrl={postInfo?.profileUrl ? postInfo.profileUrl : ""}
                  followerCount={postInfo?.follower || 0}
                  followingCount={postInfo?.followee || 0}
                  isFollow={false}
                  isWithdrawn={postInfo?.isWithdrawn}
                  isWriter={true}
                  onClick={() => router.push(`/user/${postInfo?.userSid}`)}
                />
                <Body>
                  <Title>{postInfo?.name}</Title>
                  <Category>
                    {postInfo?.gender && getGenderLabel(postInfo?.gender)}
                    {postInfo?.category && postInfo?.gender
                      ? ` / ${postInfo?.category}`
                      : postInfo?.category}
                    {postInfo?.style && (postInfo?.gender || postInfo?.category)
                      ? ` / ${postInfo?.style}`
                      : postInfo?.style}
                  </Category>
                  <Info>
                    <Row>
                      <Label>옷 정보</Label>
                      <ShoppingUrl
                        href={postInfo?.shoppingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          maxWidth: "80%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          verticalAlign: "middle",
                        }}
                      >
                        {postInfo?.shoppingUrl ? postInfo.shoppingUrl : "없음"}
                      </ShoppingUrl>
                    </Row>
                    <Row>
                      <Label>구매처</Label>
                      <div>{postInfo?.brand ? postInfo.brand : "없음"}</div>
                    </Row>
                    <Row>
                      <Label>구매 가격</Label>
                      <div>
                        {postInfo?.price
                          ? `${formatPrice(postInfo?.price || 0)}원`
                          : "없음"}
                      </div>
                    </Row>
                  </Info>
                  <div>옷 후기</div>
                  <Box>{postInfo?.description}</Box>
                </Body>
              </>
            ) : (
              <>
                <SkeletonBox height="300px" />
                <SkeletonProfile>
                  <SkeletonCircle width="45px" height="45px" />
                  <SkeletonDiv>
                    <SkeletonText width="60%" />
                  </SkeletonDiv>
                </SkeletonProfile>
              </>
            )}
          </Content>
          {/* 삭제하기 모달 */}
          {deleteModal && (
            <Modal
              title="정말 삭제하시겠습니까?"
              text="채팅 중인 글의 경우, 삭제를 주의해주세요."
              no="취소"
              yes="삭제"
              onClose={() => setDeleteModal(false)}
              onCheck={handleSubmitDelete}
              width="305px"
              height="170px"
            />
          )}
        </Container>
      </Layout>
    </>
  );
};

export default Page;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(95, 95, 95, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;

const Head = styled.div`
  width: 100%;
  padding: 35px 30px 12px 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${(props) => props.theme.fonts.h2_bold};
`;

const Menu = styled.div`
  position: relative;
`;

const Content = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ImageSlide = styled.div`
  width: 100%;
  height: 300px;
  background-color: white;
  .slick-slide img {
    width: auto;
    height: 100%;
    object-fit: contain; // 이미지 비율 유지하면서 전체 표시, 잘리지 않도록 설정
    background-color: white;
    border-radius: 7px;
  }
`;

const StyledSlider = styled(Slider)`
  height: 300px;
  width: 100%;
  position: relative;
  .slick-prev::before,
  .slick-next::before {
    opacity: 0;
    display: none;
  }
  .slick-slide div {
    cursor: pointer;
  }
`;

const Div = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
  z-index: 30;
`;

const DivNext = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  z-index: 30;
`;

const ImageBox = styled.div`
  position: relative;
  width: 100%;
  min-height: 300px;
  background-color: white;
  img {
    width: auto;
    height: 100%;
    object-fit: contain;
    background-color: white;
  }
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px 48px;
  gap: 14px;
  margin-bottom: 50px;
`;

const Title = styled.div`
  ${(props) => props.theme.fonts.h2_medium};
`;

const Category = styled.div`
  color: ${theme.colors.gray900};
  ${(props) => props.theme.fonts.b2_regular};
`;

const Info = styled.div`
  width: 100%;
  color: ${theme.colors.b100};
  ${(props) => props.theme.fonts.b2_regular};
  text-align: left;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const Label = styled.div`
  min-width: 105px;
  white-space: nowrap;
`;

const ShoppingUrl = styled.a`
  width: auto;
  :hover {
    text-decoration: underline;
  }
`;

const Box = styled.div`
  width: 100%;
  min-height: 150px;
  padding: 17px;
  border-radius: 7px;
  border: 1px solid ${theme.colors.gray300};
  background: ${theme.colors.white};
  box-shadow: 4px 4px 15px 3px rgba(247, 247, 247, 0.842);
  ${(props) => props.theme.fonts.b2_regular};
  color: ${theme.colors.b100};
`;
