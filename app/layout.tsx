// import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ThemeProvider from "./utils/Theme";
import { ReduxProvider } from "./redux/reduxProvider";
import MtChilden from "./components/MtChilden";

export const metadata = {
  title: "Q & A",
  description: "Questions & Answers",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <ReduxProvider>
          <ThemeProvider>
            {/* کانتینر اصلی با تگ استاندارد div و استایل‌های Flexbox */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Header />

              {/* 
                تگ اصلی محتوا (main):
                با اختصاص flex: 1 کل فضای خالی باقی‌مانده را پر کرده 
                و پدینگ بالایی 120px را جایگزین marginTop بدنه می‌کند.
              */}
              <main
                style={{
                  flex: 1,
                  paddingTop: "120px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MtChilden children={children} />
                {/* {children} */}
              </main>

              <Footer />
            </div>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
