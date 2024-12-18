import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Tabbar from "@/components/common/Tabbar";
import { theme } from "@/styles/theme";

interface LoginPageProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSave: () => void;
  save: boolean;
  error: string;
  handleLogin: () => void;
}

export default function LoginPage({
  email,
  setEmail,
  password,
  setPassword,
  handleSave,
  save,
  error,
  handleLogin,
}: LoginPageProps) {
  return (
    <>
      <Layout>
        <Background>
          <Image
            src="/assets/images/shape.svg"
            width={575}
            height={592}
            alt="logo"
          />
        </Background>
        <Character>
          <Image
            src="/assets/images/character.svg"
            width={48}
            height={55}
            alt="logo"
          />
        </Character>
        <Logo>
          <Image
            src="/assets/images/logo.svg"
            width={111}
            height={36}
            alt="logo"
          />
        </Logo>
        <Story>
          옷은 많은데...
          <br />
          입을 게 없네?
          <Small>
            Clothes:er와 함께
            <br /> 동네 주민들과 옷장을 공유해봐요!
          </Small>
        </Story>
        <Login>
          <Purple>LOGIN</Purple>
          <InputBox>
            <Input
              size="small"
              value={email}
              onChange={(value: string) => setEmail(value)}
              placeholder="이메일"
            />
            <Input
              size="small"
              inputType="password"
              value={password}
              onChange={(value: string) => setPassword(value)}
              placeholder="비밀번호"
            />
          </InputBox>
          <Save $save={save} onClick={handleSave}>
            {save ? (
              <Image
                src="/assets/icons/ic_save.svg"
                width={23}
                height={23}
                alt="check"
              />
            ) : (
              <Image
                src="/assets/icons/ic_notsave.svg"
                width={23}
                height={23}
                alt="check"
              />
            )}
            로그인 정보 저장하기
          </Save>
          <Error error={error}>{error}</Error>
          <Button
            text="로그인"
            buttonType="primaryDeep"
            onClick={handleLogin}
            disabled={!(email && password)}
          />
          <Nav>
            <Link href="/join/terms">회원가입</Link>
            {/* <Link href="/findId">아이디 찾기</Link>|
            <Link href="/findPw">비밀번호 찾기</Link> */}
          </Nav>
        </Login>
      </Layout>
      <Tabbar disabled={true} />
    </>
  );
}

const Layout = styled.div`
  max-width: 560px;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  padding: 40px;
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

const Character = styled.div`
  position: absolute;
  top: 100px;
  right: 50px;
`;

const Logo = styled.div`
  width: 100%;
  margin-bottom: 45px;
  z-index: 10;
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

const Small = styled.div`
  ${(props) => props.theme.fonts.b2_regular};
`;

const Login = styled.div`
  width: 100%;
  border-radius: 15px;
  padding: 24px 28px 40px 28px;
  background: ${theme.colors.white};
  box-shadow: 0px 4px 30px 0px rgba(171, 171, 171, 0.25);
  display: flex;
  flex-direction: column;
  text-align: center;
  z-index: 10;
  color: ${theme.colors.gray900};
  ${(props) => props.theme.fonts.b3_medium};
`;

const Purple = styled.div`
  color: ${theme.colors.purple500};
  text-align: center;
  ${(props) => props.theme.fonts.h1_medium}
  margin-bottom: 24px;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Save = styled.div<{ $save: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 7px;
  justify-content: flex-start;
  align-items: center;
  color: ${({ $save, theme }) =>
    $save ? "rgba(90, 66, 238, 0.7)" : theme.colors.gray900};
  cursor: pointer;
  margin-bottom: 8px;
`;

const Error = styled.div<{ error: string }>`
  text-align: center;
  height: 16px;
  padding-left: 10px;
  color: ${(props) => props.theme.colors.red};
  ${(props) => props.theme.fonts.c1_regular};
  opacity: ${(props) => (props.error ? 1 : 0)};
  margin-bottom: 8px;
`;

const Nav = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3px;
  justify-content: center;
  margin-top: 16px;
  ${(props) => props.theme.fonts.b3_regular};
  &:hover {
    color: ${theme.colors.purple500};
    ${(props) => props.theme.fonts.b3_medium};
  }
`;
