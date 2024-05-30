import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`  

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  width: 100%;
  max-width: 480px;
  min-height: 100%;
  margin: 0 auto;
  box-shadow: 0px 0px 64px 0px rgba(30, 41, 59, 0.1);
}

body {
  width: 100%;
  height: 100%;
  font-family: "Pretendard";
  white-space: pre-line;
}

a {
  color: inherit;
  text-decoration: none;
}


@font-face {
    font-family: "Pretendard";
    src: url("/public/assets/fonts/PretendardVariable.woff2") format('font-woff2'); 
  }
`;

export default GlobalStyles;