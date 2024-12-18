import { PostList } from "@/type/post";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { formatPrice } from "@/lib/formatPrice";
import { deleteRentalLike, postRentalLike } from "@/api/like";
import { getIsSuspended } from "@/util/storage";

const Post: React.FC<PostList> = ({
  id,
  postType = "normal",
  imgUrl,
  nickname,
  brand,
  title,
  minPrice,
  minDays,
  isDeleted = false,
  isReviewed = false, // 후기 작성 여부 (후기 보내기, 작성 완료)
  showReviewed = false, // 후기 버튼 유무
  isRestricted = false,
  isSuspended = false,
  isWithdrawn = false,
  onClickReview,
  onClickChoice,
  createdAt,
  startDate,
  endDate,
  size = "normal",
  isSelected = false,
  roomId,
  isLikeList = false,
  isLiked = false,
}) => {
  const router = useRouter();

  const [isMeSuspended, setIsMeSuspended] = useState<string | null>(null);
  const [heart, setHeart] = useState<boolean>(isLiked);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const suspended = getIsSuspended();
      setIsMeSuspended(suspended);
    }
  }, []);

  const handleDetail = () => {
    if (onClickChoice && id !== undefined) {
      onClickChoice(id);
    } else if (postType === "transition") {
      router.push(`/chat/${roomId}?type=rental`);
    } else if (!isDeleted) {
      router.push(`/home/${id}`);
    }
  };

  const handlePickHeart = async (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    // 찜하기 API
    if (id) {
      if (heart) {
        await deleteRentalLike(id);
        setHeart(false);
      } else {
        await postRentalLike(id);
        setHeart(true);
      }
    }
  };

  const handleReviewButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    if (onClickReview) {
      onClickReview();
    }
  };

  return (
    <Container
      onClick={handleDetail}
      size={size}
      $isSelected={isSelected}
      $isDeleted={isDeleted}
    >
      <LeftDiv>
        <Image
          src={`${imgUrl ? imgUrl : "/assets/images/noImage.svg"}`}
          width={size === "small" ? 60 : 76}
          height={size === "small" ? 60 : 76}
          alt="image"
          style={{ borderRadius: "10px" }}
        />
        <Box>
          <Title>{title}</Title>
          <Row>
            <Bottom>
              <Price>
                {isDeleted
                  ? "삭제된 게시물입니다"
                  : postType === "choice"
                  ? `구매가 ${
                      minPrice ? `${formatPrice(minPrice || 0)}원` : "미기재"
                    }`
                  : `${formatPrice(minPrice || 0)}원~`}
              </Price>
              <Days>
                {isDeleted ? "" : postType !== "choice" && `${minDays}day`}
              </Days>
            </Bottom>
            {isMeSuspended !== "true" && showReviewed && (
              <ReviewButton
                onClick={handleReviewButtonClick}
                disabled={isReviewed}
              >
                <Image
                  src="/assets/icons/ic_review.svg"
                  width={12}
                  height={12}
                  alt="review"
                />
                {isReviewed ? "후기 작성 완료" : "후기 작성하기"}
              </ReviewButton>
            )}
          </Row>
          <Sub>
            {(postType === "my" || postType === "choice") && (
              <>
                <Span $disabled={!brand}>{brand ? brand : "미기재"}</Span> |{" "}
                {` `}
              </>
            )}
            {nickname && (
              <>
                {isWithdrawn ? (
                  "탈퇴한 회원"
                ) : (
                  <>
                    <Span>{nickname} </Span> 님
                  </>
                )}{" "}
                | {` `}
              </>
            )}
            {postType === "rental" || postType === "transition"
              ? `${startDate?.slice(2).replace(/-/g, "/")}~${endDate
                  ?.slice(2)
                  .replace(/-/g, "/")}`
              : createdAt}
          </Sub>
        </Box>
      </LeftDiv>
      {isLikeList && (
        <Image
          src={`/assets/icons/ic_heart${heart ? "_fill" : ""}.svg`}
          width={20}
          height={20}
          alt="찜"
          onClick={handlePickHeart}
        />
      )}
    </Container>
  );
};

export default Post;

const Container = styled.div<{
  size: string;
  $isSelected: boolean;
  $isDeleted: boolean;
}>`
  display: flex;
  width: 100%;
  height: 100px;
  padding: 24px 8px;
  justify-content: space-between;
  align-items: center;
  gap: 19px;
  ${(props) =>
    props.size === "small" &&
    css`
      border-bottom: 0.5px solid rgba(219, 219, 219, 0.7);
    `}
  cursor: pointer;
  ${(props) =>
    props.$isSelected &&
    css`
      background-color: ${theme.colors.purple10};
    `}

  ${(props) =>
    props.$isDeleted &&
    css`
      opacity: 0.7;
      pointer-events: none;
    `}
`;

const LeftDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
`;

const Title = styled.div`
  color: ${theme.colors.black};
  ${(props) => props.theme.fonts.b2_medium};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Bottom = styled(Row)`
  align-items: flex-end;
  gap: 10px;
`;

const Price = styled.div`
  color: ${theme.colors.purple400};
  ${(props) => props.theme.fonts.b2_semiBold};
`;

const Days = styled.div`
  color: ${theme.colors.gray900};
  ${(props) => props.theme.fonts.c1_regular};
  margin-bottom: 2px;
`;

const ReviewButton = styled.button`
  height: 28px;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border: 0.5px solid ${theme.colors.gray700};
  background: ${theme.colors.white};
  color: ${theme.colors.b100};
  ${(props) => props.theme.fonts.c1_medium};

  &:disabled {
    background: ${theme.colors.gray100};
  }
`;

const Sub = styled.div`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.c2_regular};
  font-size: 13px;
`;

const Span = styled.span<{ $disabled?: boolean }>`
  color: ${theme.colors.purple400};

  ${({ $disabled }) =>
    $disabled &&
    css`
      color: ${theme.colors.b100};
      cursor: auto;
      &:hover {
        text-decoration: none;
      }
    `}
`;
