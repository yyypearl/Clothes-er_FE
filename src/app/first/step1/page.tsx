"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

const Step1 = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");

  const handleNext = () => {
    console.log(location);
    router.push("/first/step2");
  };

  return (
    <Layout>
      <Background>
        <Image
          src="/assets/images/shape.svg"
          width={575}
          height={592}
          alt="logo"
        />
      </Background>
      <Content>
        <Story>
          동네 설정을 위한
          <br />
          주소를 입력해주세요.
        </Story>
        <Box>
          <Input
            value={location}
            onChange={(value: string) => setLocation(value)}
            placeholder="주소"
          />
          <Button
            buttonType="primaryDeep"
            size="large"
            text="다음 단계"
            onClick={handleNext}
            disabled={!location}
          />
        </Box>
      </Content>
    </Layout>
  );
};

export default Step1;

const Layout = styled.div`
  max-width: 560px;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  padding: 86px 40px 38px 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0px;
  z-index: 0;
`;

const Content = styled.div`
  z-index: 10;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 404px;
`;

const Story = styled.div`
  width: 100%;
  text-align: left;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.h1_bold};
  z-index: 10;
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
