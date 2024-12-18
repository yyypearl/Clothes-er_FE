"use client";

import AuthAxios from "@/api/authAxios";
import Button from "@/components/common/Button";
import Category from "@/components/common/Category";
import Input from "@/components/common/Input";
import Toggle from "@/components/common/Toggle";
import Topbar from "@/components/common/Topbar";
import { convertURLtoFile } from "@/lib/convertURLtoFile";
import { formatPrice, removeCommas } from "@/lib/formatPrice";
import {
  clearCategory,
  setSelectedCategory,
  setSelectedGender,
  setSelectedStyle,
} from "@/redux/slices/categorySlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import { getAccessToken } from "@/util/storage";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import styled from "styled-components";

const Modify = () => {
  const { clothesId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const selectedGender = useSelector(
    (state: RootState) => state.category.selectedGender
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.category.selectedCategory
  );
  const selectedStyle = useSelector(
    (state: RootState) => state.category.selectedStyle
  );

  const [images, setImages] = useState<File[]>([]);
  const [inputs, setInputs] = useState<{
    name: string;
    description: string;
    gender: string;
    category: string;
    style: string;
    price: string;
    isPublic: boolean;
    brand: string;
    size: string;
    shoppingUrl: string;
    rentalId: number | null;
  }>({
    name: "",
    description: "",
    gender: selectedGender || "",
    category: selectedCategory || "",
    style: selectedStyle || "",
    isPublic: true,
    price: "",
    brand: "",
    size: "",
    shoppingUrl: "",
    rentalId: null,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedImages: File[] = Array.from(files).slice(0, 3);
      if (images.length + selectedImages.length > 3) {
        alert("이미지는 최대 3개까지 선택할 수 있습니다.");
        return;
      }
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const handleImageClick = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  /* 내용 불러오기 (get)*/
  useEffect(() => {
    AuthAxios.get(`/api/v1/clothes/${clothesId}`)
      .then(async (response) => {
        const data = response.data.result;
        setInputs((prevInputs) => ({
          ...prevInputs,
          ...data,
          price: formatPrice(data.price),
        }));
        dispatch(setSelectedGender(data.gender));
        dispatch(setSelectedCategory(data.category));
        dispatch(setSelectedStyle(data.style));

        // 이미지 URL을 File 객체로 변환
        const filePromises = data.imgUrls.map((image: string) =>
          convertURLtoFile(image)
        );
        const files = await Promise.all(filePromises);
        setImages(files);
        console.log(data);
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  /* 수정하기 */
  const handleModifyPost = () => {
    const priceWithoutCommas = inputs.price
      ? removeCommas(inputs.price as string)
      : null;

    const formData = new FormData();

    formData.append(
      "clothes",
      new Blob(
        [
          JSON.stringify({
            name: inputs.name,
            description: inputs.description,
            gender: selectedGender,
            category: selectedCategory,
            style: selectedStyle,
            isPublic: inputs.isPublic,
            price: priceWithoutCommas,
            brand: inputs.brand,
            size: inputs.size,
            shoppingUrl: inputs.shoppingUrl,
            rentalId: inputs.rentalId,
          }),
        ],
        { type: "application/json" }
      )
    );

    // File 객체로 된 이미지 추가
    images.forEach((file) => {
      formData.append("images", file, file.name);
    });

    console.log("전달하는 formData", formData);
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    axios
      .put(`/api/v1/clothes/${clothesId}`, formData, {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
      .then((response) => {
        console.log(response.data.result);
        dispatch(clearCategory());
        router.push(`/mycloset/${clothesId}`);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <Layout>
      <div>
        <Image
          src="/assets/images/logo_black.svg"
          width={101}
          height={18}
          alt="logo"
          onClick={() => router.push("/home")}
          style={{ cursor: "pointer" }}
        />
        <Topbar text="보유 글 수정" icon={true} align="center" />
        <Content>
          <ColumnMargin>
            <Photo>
              <AddPhoto>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <Image
                  src="/assets/icons/ic_camera.svg"
                  width={24}
                  height={24}
                  alt="add photo"
                />
              </AddPhoto>
              <PhotoList>
                <TransitionGroup component={null}>
                  {images.map((image, index) => (
                    <CSSTransition key={index} timeout={300} classNames="fade">
                      {typeof window !== "undefined" && (
                        <StyledImage
                          key={index}
                          src={
                            image instanceof File
                              ? URL.createObjectURL(image)
                              : image
                          }
                          width={65}
                          height={65}
                          alt={`photo-${index}`}
                          onClick={() => handleImageClick(index)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </PhotoList>
            </Photo>
          </ColumnMargin>
          <ColumnMargin>
            <Label>카테고리</Label>
            <Category />
          </ColumnMargin>
          <Column>
            <Label>
              상품명<Span>*</Span>
            </Label>
            <Input
              inputType="write"
              size="small"
              value={inputs.name}
              placeholder="제목"
              onChange={(value: string) => {
                setInputs({ ...inputs, name: value });
              }}
            />
          </Column>
          <Row>
            <Column>
              <Label>구매 가격</Label>
              <Input
                inputType="write"
                size="small"
                value={inputs.price}
                placeholder="가격"
                onChange={(value: string) => {
                  const numericValue = value.replace(/[^0-9]/g, "");
                  const formattedValue = numericValue
                    ? new Intl.NumberFormat().format(Number(numericValue))
                    : "";
                  setInputs({ ...inputs, price: formattedValue });
                }}
              />
            </Column>
            <Column>
              <Label>
                공개 여부<Span>*</Span>
              </Label>
              <Toggle
                isOn={inputs.isPublic}
                onToggle={() =>
                  setInputs({ ...inputs, isPublic: !inputs.isPublic })
                }
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Label>브랜드</Label>
              <Input
                inputType="write"
                size="small"
                value={inputs.brand}
                placeholder="없음"
                onChange={(value: string) => {
                  setInputs({ ...inputs, brand: value });
                }}
              />
            </Column>
            <Column>
              <Label>사이즈</Label>
              <Input
                inputType="write"
                size="small"
                value={inputs.size}
                placeholder="직접 입력"
                onChange={(value: string) => {
                  setInputs({ ...inputs, size: value });
                }}
              />
            </Column>
          </Row>
          <Column>
            <Label>구매 링크</Label>
            <Input
              inputType="write"
              size="small"
              value={inputs.shoppingUrl}
              placeholder="url 입력"
              onChange={(value: string) => {
                setInputs({ ...inputs, shoppingUrl: value });
              }}
            />
          </Column>
          <Column>
            <Label>
              옷 후기<Span>*</Span>
            </Label>
            <TextAreaInput
              value={inputs.description}
              placeholder="본인만의 옷 후기를 작성해주세요! 상세하게 적을수록 다른 유저들에게도 많은 도움이 된답니다:)"
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setInputs({ ...inputs, description: event.target.value });
              }}
            />
          </Column>
        </Content>
      </div>
      <Button
        buttonType="primary"
        size="large"
        text="수정 완료"
        onClick={handleModifyPost}
        disabled={
          !inputs.name || inputs.isPublic === null || !inputs.description
        }
      />
    </Layout>
  );
};

export default Modify;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 37px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

const Top = styled.div`
  width: calc(50% + 60px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
  margin-bottom: 15px;
  ${(props) => props.theme.fonts.h2_bold};
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Photo = styled.div`
  display: flex;
  gap: 11px;
`;

const AddPhoto = styled.label`
  width: 65px;
  height: 65px;
  border-radius: 10px;
  border: 1px solid ${theme.colors.gray700};
  box-shadow: 2px 2px 5px 2px rgba(220, 220, 220, 0.25);
  background: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PhotoList = styled.div`
  display: flex;
  gap: 10px;
`;

const StyledImage = styled(Image)`
  border-radius: 10px;
  box-shadow: 2px 2px 5px 2px rgba(220, 220, 220, 0.25);
`;

const Label = styled.div`
  display: flex;
  gap: 3px;
  ${(props) => props.theme.fonts.c1_bold};
`;

const Span = styled.span`
  color: ${theme.colors.purple700};
`;

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const ColumnMargin = styled(Column)`
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const TextAreaInput = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid ${theme.colors.gray700};
  background: #fff;
  color: ${theme.colors.b100};
  outline: none;
  resize: none;
  ${(props) => props.theme.fonts.c1_regular};
  &::placeholder {
    color: ${theme.colors.gray600};
  }
`;

const SubmitButton = styled.div`
  position: sticky;
  bottom: 20px;
  left: 50%;
`;
