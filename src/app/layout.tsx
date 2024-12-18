"use client";

import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import GlobalStyles from "@/styles/GlobalStyle";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import StyledJsxRegistry from "./registry";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <title>클로저 Clothes:er</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
        <meta name="theme-color" content="#796EF2" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <StyledJsxRegistry>
          <Provider store={store}>
            <Toaster />
            <ThemeProvider theme={theme}>
              <GlobalStyles />
              {children}
            </ThemeProvider>
          </Provider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
