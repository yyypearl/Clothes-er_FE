"use client";

import Axios from "@/api/axios";
import BottomModal from "@/components/common/BottomModal";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Progressbar from "@/components/common/Progressbar";
import { setStep3 } from "@/redux/slices/signInSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { postSignUpData } from "@/redux/thunks/postSignIn";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Step3 = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const step3 = useSelector((state: RootState) => state.signIn.step3);

  const [inputs, setInputs] = useState({
    phone: "",
    phoneAuth: "",
  });

  /* 에러 메세지 */
  const [errors, setErrors] = useState({
    phone: "",
    phoneAuth: "",
  });

  /* 성공 메세지 */
  const [success, setSuccess] = useState({
    phone: "",
    phoneAuth: "",
  });

  /* 휴대폰 문자 발송 여부 */
  const [phoneSent, setPhoneSent] = useState(false);

  /* 휴대폰 인증 코드 확인 여부 */
  const [correctCode, setCorrectCode] = useState(false);

  const [nickname, setNickname] = useState("");

  /* 회원가입 축하 모달 */
  const [complete, setComplete] = useState<boolean>(false);

  /* 타이머 */
  const [timer, setTimer] = useState<number>(180);
  const [timerColor, setTimerColor] = useState<string>(theme.colors.purple500);

  useEffect(() => {
    setInputs(step3);
  }, []);

  const validatePhone = (phone: string) => {
    const regex = /^010-\d{4}-\d{4}$/;
    if (!regex.test(phone) && !(phone.length === 0)) {
      setErrors({
        ...errors,
        phone: "전화번호 형식이 올바르지 않습니다.",
      });
    } else {
      setErrors({ ...errors, phone: "" });
    }
  };

  const validatePhoneAuth = (phoneAuth: string) => {
    if (phoneAuth.length !== 6) {
      setErrors({ ...errors, phoneAuth: "인증번호 6자리를 입력해주세요." });
    } else {
      setErrors({ ...errors, phoneAuth: "" });
    }
  };

  /* 전화번호 자동 하이픈 생성 */
  useEffect(() => {
    validatePhone(inputs.phone);
    if (inputs.phone.length === 11) {
      setInputs({
        ...inputs,
        phone: inputs.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"),
      });
    } else if (inputs.phone.length === 12 || 13) {
      setInputs({
        ...inputs,
        phone: inputs.phone
          //하이픈이 입력되면 공백으로 변경되고 하이픈이 다시 생성됨
          .replace(/-/g, "")
          .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"),
      });
    }
    dispatch(
      setStep3({
        ...inputs,
        phone: inputs.phone,
      })
    );
  }, [inputs.phone]);

  /* 타이머 */
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (phoneSent) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 0) {
            clearInterval(intervalId);
            setPhoneSent(false);
            setCorrectCode(false);
            setSuccess({ ...success, phone: "" });
            setInputs({ ...inputs, phoneAuth: "" });
            setErrors({ ...errors, phoneAuth: "" });
            setTimer(180);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 타이머 색상 업데이트
      if (timer <= 30) {
        setTimerColor(theme.colors.red);
      } else {
        setTimerColor(theme.colors.purple500);
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [phoneSent, timer]);

  /* 휴대폰 인증번호 전송 */
  const handleSendPhone = () => {
    Axios.post("/api/v1/users/send-phone", { phoneNumber: inputs.phone })
      .then((response) => {
        console.log("휴대폰 인증번호 전송 성공", response.data);
        setPhoneSent(true);
        setTimer(180);
        setSuccess({ ...success, phone: "인증번호가 전송되었습니다." });
        setCorrectCode(false);
        setInputs({ ...inputs, phoneAuth: "" });
        setSuccess({ ...success, phoneAuth: "" });
        setErrors({ ...errors, phoneAuth: "" });
      })
      .catch((error) => {
        console.log("휴대폰 인증 실패", error);
        setSuccess({ ...success, phone: "" });
        setErrors({ ...errors, phone: error.response.data.message });
      });
  };

  /* 휴대폰 인증번호 확인 */
  const handleValidateCode = () => {
    Axios.post("/api/v1/users/check-phone", {
      phoneNumber: inputs.phone,
      authCode: inputs.phoneAuth,
    })
      .then((response) => {
        console.log("휴대폰  인증 성공", response.data);
        setCorrectCode(true);
        setSuccess({ ...success, phoneAuth: "휴대폰이 인증되었습니다." });
      })
      .catch((error) => {
        console.log("휴대폰 인증 실패", error);
        setCorrectCode(false);
        setSuccess({ ...success, phoneAuth: "" });
        setErrors({ ...errors, phoneAuth: error.response.data.message });
      });
  };

  /* 회원가입 */
  const handleSignUp = () => {
    dispatch(postSignUpData())
      .unwrap()
      .then((data) => {
        console.log("회원가입 성공:", data);
        setNickname(data.result.nickname);
        setComplete(true);
      })
      .catch((error) => {
        console.error("회원가입 실패:", error.message);
      });
  };

  const handleCloseModal = () => {
    setComplete(false);
    router.push("/");
  };

  return (
    <Container>
      <Progressbar step={3} />
      <Hello>
        Clothes:er에 오신 것을
        <br /> 환영합니다!
      </Hello>
      <InputBox>
        <Row>
          <Input
            label="전화번호"
            value={inputs.phone}
            size="small"
            placeholder="010-0000-0000"
            successMsg={success.phone}
            errorMsg={errors.phone}
            onChange={(value: string) => {
              validatePhone(value);
              setInputs({ ...inputs, phone: value });
              dispatch(
                setStep3({
                  ...inputs,
                  phone: value,
                })
              );
            }}
          />
          <CheckButton>
            <Button
              buttonType="primaryLight"
              size="small"
              text="인증"
              onClick={handleSendPhone}
            />
          </CheckButton>
        </Row>
        <Row>
          <TimerDiv>
            <Input
              label="전화번호 인증"
              value={inputs.phoneAuth}
              size="small"
              placeholder="인증번호"
              successMsg={success.phoneAuth}
              errorMsg={errors.phoneAuth}
              onChange={(value: string) => {
                validatePhoneAuth(value);
                setInputs({ ...inputs, phoneAuth: value });
                dispatch(
                  setStep3({
                    ...inputs,
                    phoneAuth: value,
                  })
                );
              }}
              disabled={!phoneSent}
            />
            {phoneSent && !correctCode && (
              <Timer color={timerColor}>{`${Math.floor(timer / 60)}:${String(
                timer % 60
              ).padStart(2, "0")}`}</Timer>
            )}
          </TimerDiv>
          <CheckButton>
            <Button
              buttonType="primaryLight"
              size="small"
              text="확인"
              onClick={handleValidateCode}
              disabled={
                !phoneSent || !!errors.phoneAuth || inputs.phoneAuth === ""
              }
            />
          </CheckButton>
        </Row>
      </InputBox>
      <ButtonRow>
        <Button
          text="이전 단계"
          size="medium"
          onClick={() => router.push("/join/step2")}
        />
        <Button
          text="회원가입"
          size="medium"
          onClick={handleSignUp}
          disabled={!correctCode}
        />
      </ButtonRow>

      {/* 회원가입 축하 모달 */}
      {complete && (
        <BottomModal
          title={`${nickname} 님의\n회원가입을 축하합니다!`}
          buttonText="로그인으로 이동"
          onClose={handleCloseModal}
          autoClose={true}
        >
          <CongratulateImage
            src="/assets/images/congratulate.svg"
            width={128}
            height={106}
            alt="축하"
          />
          <Em>클로저와 함께 다양한 서비스를 이용해보세요!</Em>
          <List>
            <li>공유옷장에서 옷을 대여해요.</li>
            <li>다른 사람들의 옷장을 구경해요.</li>
          </List>
        </BottomModal>
      )}
    </Container>
  );
};

export default Step3;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Hello = styled.div`
  text-align: left;
  color: ${theme.colors.b500};
  ${(props) => props.theme.fonts.h2_bold};
  margin-bottom: 29px;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 50px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
`;

const CheckButton = styled.div`
  margin-bottom: 20px;
`;

const TimerDiv = styled.div`
  width: 100%;
  height: 90px;
  position: relative;
`;
const Timer = styled.div<{ color: string }>`
  position: absolute;
  bottom: 35px;
  right: 20px;
  font-size: 14px;
  color: ${(props) => props.color};
  margin-top: 10px;
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: auto;
  gap: 14px;
  position: sticky;
  bottom: 25px;
  left: 0;
`;

/* 모달 */
const CongratulateImage = styled(Image)`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Em = styled.div`
  color: ${theme.colors.purple600};
  ${(props) => props.theme.fonts.b2_medium};
  margin-bottom: 12px;
`;

const List = styled.ul`
  color: ${theme.colors.b100};
  ${(props) => props.theme.fonts.b3_medium};

  li {
    margin-left: 15px;
    margin-bottom: 6px;
  }
`;
