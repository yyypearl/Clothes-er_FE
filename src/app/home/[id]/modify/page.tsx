"use client";

import AuthAxios from "@/api/authAxios";
import Button from "@/components/common/Button";
import Category from "@/components/common/Category";
import Input from "@/components/common/Input";
import Topbar from "@/components/common/Topbar";
import { convertURLtoFile } from "@/lib/convertURLtoFile";
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

interface Price {
  days: number | null;
  price: number | null;
}

const Modify = () => {
  const { id } = useParams();
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

  const [clothesId, setClothesId] = useState<number | null>(null);
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

  /* 내용 불러오기 (get)*/
  useEffect(() => {
    AuthAxios.get(`/api/v1/rentals/${id}`)
      .then(async (response) => {
        const data = response.data.result;
        setInputs(data);
        if (data.clothesId) {
          setClothesId(data.clothesId);
        }
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

  /* 수정하기 */
  const handleModifyPost = async () => {
    const formattedPrices = inputs.prices.map((price) => ({
      days: price.days,
      price: price.price !== null ? Number(price.price) : null,
    }));

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
            prices: formattedPrices,
            brand: inputs.brand,
            size: inputs.size,
            fit: inputs.fit,
            clothesId: clothesId || null,
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
      .put(`/api/v1/rentals/${id}`, formData, {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
      .then((response) => {
        console.log(response.data.result);
        dispatch(clearCategory());
        router.push(`/home/${id}`);
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
        <Topbar text="대여 글 수정" icon={true} align="center" />
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
              제목<Span>*</Span>
            </Label>
            <Input
              inputType="write"
              size="small"
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
              {inputs.prices.map((price, index) => {
                const formattedPrice = price.price
                  ? new Intl.NumberFormat().format(Number(price.price))
                  : "";

                return (
                  <PriceBox key={index}>
                    <Input
                      inputType="write"
                      size="small"
                      value={price.days}
                      placeholder="날짜"
                      onChange={(value: string) =>
                        handlePriceChange(index, "days", value)
                      }
                      disabled={price.days === 5 || price.days === 10}
                    />
                    <Input
                      inputType="write"
                      size="small"
                      value={formattedPrice}
                      placeholder="가격"
                      onChange={(value: string) => {
                        const numericValue = value.replace(/[^0-9]/g, "");
                        handlePriceChange(index, "price", numericValue);
                      }}
                    />
                  </PriceBox>
                );
              })}
            </PriceBoxList>
          </Column>
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
            <Label>핏</Label>
            <Input
              inputType="write"
              size="small"
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
      <Button
        buttonType="primary"
        size="large"
        text="수정 완료"
        onClick={handleModifyPost}
        disabled={!inputs.title || !inputs.prices || !inputs.description}
      />
    </Layout>
  );
};

export default Modify;

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  padding: 37px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const ColumnMargin = styled(Column)`
  margin-bottom: 15px;
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
