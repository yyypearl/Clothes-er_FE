"use client";

import AuthAxios from "@/api/authAxios";
import Modal from "@/components/common/Modal";
import Topbar from "@/components/common/Topbar";
import { showToast } from "@/hooks/showToast";
import { clearUser } from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";
import { clearTokens, getRefreshToken } from "@/util/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

const Setting = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [confirmWithdraw, setConfirmWithdraw] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getRefreshToken();
      setRefreshToken(token);
    }
  }, []);

  const handleLogout = () => {
    if (refreshToken) {
      AuthAxios.post("/api/v1/users/logout", {
        refreshToken,
      })
        .then((response) => {
          console.log("로그아웃 성공", response);
          showToast({
            text: `성공적으로 로그아웃 되었습니다.`,
            icon: "💜",
            type: "success",
          });
          clearTokens();
          dispatch(clearUser());
          router.push("/");
        })
        .catch((error) => {
          console.log("로그아웃 실패", error);
        });
    }
  };

  const handleWithdrawal = () => {
    AuthAxios.delete("/api/v1/users/withdraw")
      .then((response) => {
        console.log("회원탈퇴 성공", response);
        showToast({
          text: `성공적으로 회원탈퇴 되었습니다.`,
          icon: "👋🏻",
          type: "success",
        });
        clearTokens();
        dispatch(clearUser());
        router.push("/");
      })
      .catch((error) => {
        console.log("회원탈퇴 실패", error);
        if (error.response) {
          // 거래 중 혹은 유예된 경우
          if (
            error.response.data.code === 2160 ||
            error.response.data.code === 2131
          ) {
            console.log(error.response.data.code);
            showToast({
              text: `${error.response.data.message}`,
              icon: "❌",
              type: "error",
            });
          } else {
            console.log(error.response.data.message);
          }
        }
      });
  };

  return (
    <>
      <Layout>
        <Image
          src="/assets/images/logo_black.svg"
          width={101}
          height={18}
          alt="logo"
          onClick={() => router.push("/home")}
          style={{ cursor: "pointer" }}
        />
        <Topbar text="설정" align="center" icon={true} link="/mycloset" />
        <Content>
          <Div onClick={() => router.push("/mycloset/setting/user")}>
            계정 정보
          </Div>
          <Div>공지사항</Div>
          <Div>자주 묻는 질문</Div>
          <Div>약관 및 정책</Div>
          <Div onClick={handleLogout}>로그아웃</Div>
          <Div
            onClick={() => {
              setConfirmWithdraw(true);
            }}
          >
            탈퇴하기
          </Div>
        </Content>
        {confirmWithdraw && (
          <Modal
            title={`정말 탈퇴하시겠습니까?`}
            text={`계정 탈퇴 시 복구가 어렵습니다.\n\n또한 탈퇴 후 모든 정보들은\nClothes:er에서 관리되며,\n사용자들에게 노출될 수 있습니다.`}
            onClose={() => {
              setConfirmWithdraw(false);
            }}
            onCheck={handleWithdrawal}
            no="아니요"
            yes="네"
            width="300px"
            height="240px"
          />
        )}
      </Layout>
    </>
  );
};

export default Setting;

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  padding: 42px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${theme.colors.ivory};
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  padding: 55px 18px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 37px;
`;

const Div = styled.div`
  width: 100%;
  color: ${theme.colors.b500};
  ${(props) => props.theme.fonts.b2_medium};
  cursor: pointer;
`;
