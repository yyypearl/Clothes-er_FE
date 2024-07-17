"use client";

import Button from "@/components/common/Button";
import Category from "@/components/common/Category";
import Input from "@/components/common/Input";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import styled from "styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";
import { getToken } from "@/hooks/getToken";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCategory } from "@/redux/slices/categorySlice";
import { useRequireAuth } from "@/hooks/useAuth";

interface Price {
  days: number | null;
  price: number | null;
}
const Write = () => {
  useRequireAuth();
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
    title: string;
    description: string;
    gender: string;
    category: string;
    style: string;
    prices: Price[];
    brand: string;
    size: string;
    fit: string;
  }>({
    title: "",
    description: "",
    gender: selectedGender || "",
    category: selectedCategory || "",
    style: selectedStyle || "",
    prices: [
      { days: 5, price: null },
      { days: 10, price: null },
    ],
    brand: "",
    size: "",
    fit: "",
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

  const handleNewPost = () => {
    const formData = new FormData();

    formData.append(
      "post",
      new Blob(
        [
          JSON.stringify({
            title: inputs.title,
            description: inputs.description,
            gender: selectedGender,
            category: selectedCategory,
            style: selectedStyle,
            prices: inputs.prices,
            brand: inputs.brand,
            size: inputs.size,
            fit: inputs.fit,
          }),
        ],
        { type: "application/json" }
      )
    );

    images.forEach((file, index) => {
      formData.append(`images`, file, file.name);
    });

    console.log(inputs);
    console.log(images);
    console.log("전달하는 formData", formData);
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    axios
      .post(`http://13.209.137.34:8080/api/v1/rentals`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log(response.data.result);
        dispatch(clearCategory());
        router.push(`/home`);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const handlePriceChange = (index: number, key: string, value: string) => {
    const newPrices = [...inputs.prices];
    newPrices[index] = { ...newPrices[index], [key]: value };
    setInputs({ ...inputs, prices: newPrices });
  };

  const handleAddPrice = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      prices: [...prevInputs.prices, { days: null, price: null }],
    }));
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
        <Top>
          <Image
            src="/assets/icons/ic_arrow.svg"
            width={24}
            height={24}
            alt="back"
            onClick={() => router.back()}
            style={{ cursor: "pointer" }}
          />
          대여 글 작성
        </Top>
        <Content>
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
                alt="add phote"
              />
            </AddPhoto>
            <PhotoList>
              <TransitionGroup component={null}>
                {images.map((image, index) => (
                  <CSSTransition key={index} timeout={300} classNames="fade">
                    <StyledImage
                      key={index}
                      src={URL.createObjectURL(image)}
                      width={65}
                      height={65}
                      alt={`photo-${index}`}
                      onClick={() => handleImageClick(index)}
                      style={{ cursor: "pointer" }}
                    />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </PhotoList>
          </Photo>
          <Label>카테고리</Label>
          <Category />
          <Column>
            <Label>
              제목<Span>*</Span>
            </Label>
            <Input
              inputType="write"
              value={inputs.title}
              placeholder="제목"
              onChange={(value: string) => {
                setInputs({ ...inputs, title: value });
              }}
            />
          </Column>
          <Column>
            <Label>
              가격<Span>*</Span>
              <AddPrice onClick={handleAddPrice}>
                <Image
                  src="/assets/icons/ic_plus_purple.svg"
                  width={16}
                  height={16}
                  alt="plus"
                />
                가격 추가하기
              </AddPrice>
            </Label>
            <PriceBoxList>
              {inputs.prices.map((price, index) => (
                <PriceBox key={index}>
                  <Input
                    inputType="write"
                    value={price.days}
                    // value={price.days ? `${price.days}일` : ""}
                    placeholder="날짜"
                    onChange={(value: string) =>
                      handlePriceChange(index, "days", value)
                    }
                    disabled={price.days === 5 || price.days === 10}
                  />
                  <Input
                    inputType="write"
                    value={price.price}
                    placeholder="가격"
                    onChange={(value: string) =>
                      handlePriceChange(index, "price", value)
                    }
                  />
                </PriceBox>
              ))}
            </PriceBoxList>
          </Column>
          <Row>
            <Column>
              <Label>브랜드</Label>
              <Input
                inputType="write"
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
                value={inputs.size}
                placeholder="직접 입력"
                onChange={(value: string) => {
                  setInputs({ ...inputs, size: value });
                }}
              />
            </Column>
          </Row>
          <Column>
            <Label>핏</Label>
            <Input
              inputType="write"
              value={inputs.fit}
              placeholder="선택 없음"
              onChange={(value: string) => {
                setInputs({ ...inputs, fit: value });
              }}
            />
          </Column>
          <Column>
            <Label>
              상세 설명<Span>*</Span>
            </Label>
            <TextAreaInput
              value={inputs.description}
              placeholder="옷 상태에 대한 자세한 설명 및 구입시기, 착용 횟수 등 신뢰할 수 있는 거래를 위해 정확히 기입 부탁드립니다."
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setInputs({ ...inputs, description: event.target.value });
              }}
            />
          </Column>
        </Content>
      </div>
      <SubmitButton>
        <Button
          buttonType="primary"
          size="large"
          text="작성 완료"
          onClick={handleNewPost}
          // disabled
        />
      </SubmitButton>
    </Layout>
  );
};

export default Write;

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
  gap: 15px;
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

const PriceBoxList = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 11px;
`;

const PriceBox = styled.div`
  max-width: 184px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 11px;
`;

const Span = styled.span`
  color: ${theme.colors.purple700};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AddPrice = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.purple700};
  ${(props) => props.theme.fonts.c1_medium};
  margin-left: 10px;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
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
