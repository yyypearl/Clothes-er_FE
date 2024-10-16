import { useEffect, useState } from "react";
import Post from "../home/Post";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { getRentalLikes } from "@/api/like";
import { RentalLikeList } from "@/type/like";

interface MyShareContentProps {
  userSid?: string;
}

const StorageRentalContent: React.FC<MyShareContentProps> = ({ userSid }) => {
  const [postList, setPostList] = useState<RentalLikeList[]>();

  useEffect(() => {
    const fetchRentalLikes = async () => {
      try {
        const data = await getRentalLikes();
        setPostList(data.result);
        console.log(data);
      } catch (error) {}
    };

    fetchRentalLikes();
  }, []);

  return (
    <>
      {postList && postList?.length > 0 ? (
        <ListContainer>
          {postList.map((data) => (
            <Post
              key={data.rentalListResponse.id}
              postType="normal"
              id={data.rentalListResponse.id}
              imgUrl={data.rentalListResponse.imgUrl}
              title={data.rentalListResponse.title}
              minPrice={data.rentalListResponse.minPrice}
              minDays={data.rentalListResponse.minDays}
              createdAt={data.rentalListResponse.createdAt}
              nickname={data.rentalListResponse.nickname}
              brand={data.rentalListResponse.brand}
              isLikeList={true}
              isLiked={data.isLiked}
            />
          ))}
        </ListContainer>
      ) : (
        <NoData>
          <>지금 바로 찜하기를 시작해보세요!</>
        </NoData>
      )}
    </>
  );
};

export default StorageRentalContent;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NoData = styled.div`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.b2_regular}

  @media screen and (max-width: 400px) {
    ${(props) => props.theme.fonts.b3_regular}
  }
`;
